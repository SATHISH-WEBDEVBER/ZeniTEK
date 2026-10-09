/**
 * Bug tracking API  (all routes require a signed-in tester or developer)
 *
 * Tester (own bugs only):
 *   GET    /api/bugs                    list my bugs
 *   GET    /api/bugs/:id                one of my bugs
 *   POST   /api/bugs                    report a bug (multipart, field "screenshots", max 5 images)
 *   PUT    /api/bugs/:id                edit my bug (multipart; removeScreenshots = JSON array of screenshot ids)
 *   DELETE /api/bugs/:id                delete my bug (+ its screenshot files)
 *
 * Developer (all bugs):
 *   GET    /api/bugs?status=&priority=&overdue=&tester=&search=   list/filter all bugs
 *   GET    /api/bugs/:id                any bug
 *   PATCH  /api/bugs/:id                update priority / status / assignedTo / developerNotes / note
 *   POST   /api/bugs/:id/complete       mark as completed
 *   GET    /api/bugs/meta               developer + tester usernames (for filters / assignment)
 *   GET    /api/bugs/reports/summary    live report counts
 *   GET    /api/bugs/reports/excel      .xlsx download (developer ONLY)
 *
 * Developers cannot delete a tester's report: reports are the testers' record of work and
 * deleting them would hide bugs from the tracking reports. Developers close bugs by completing them.
 */
import express from 'express';
import mongoose from 'mongoose';
import Bug, {
  SEVERITIES, PRIORITIES, STATUSES, DAY_MS, computeIsOverdue, serializeBug
} from '../models/Bug.js';
import { requireAuth, requireRole, getAccounts } from '../middleware/auth.js';
import {
  uploadBugScreenshots, fileToScreenshot, removeScreenshotFiles, MAX_FILES
} from '../config/bugUploads.js';

const router = express.Router();
router.use(requireAuth, requireRole('tester', 'developer'));

const isDeveloper = req => req.user.role === 'developer';
const fail = (res, status, message) => res.status(status).json({ success: false, message });

// ─── Helpers ────────────────────────────────────────────────────────────────

async function nextBugNumber() {
  const counters = mongoose.connection.collection('counters');
  const result = await counters.findOneAndUpdate(
    { _id: 'bugNumber' },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  const doc = result && result.value !== undefined ? result.value : result; // driver v5/v6 shapes
  return doc.seq;
}

function overdueFilter(now = new Date()) {
  return { status: { $ne: 'completed' }, deadline: { $lt: now } };
}

/** Persist the overdue flag so stored data, filters and reports agree. */
export async function syncOverdueFlags() {
  const now = new Date();
  const a = await Bug.updateMany({ ...overdueFilter(now), overdue: { $ne: true } }, { $set: { overdue: true } });
  const b = await Bug.updateMany(
    { overdue: true, $or: [{ status: 'completed' }, { deadline: { $gte: now } }] },
    { $set: { overdue: false } }
  );
  return { markedOverdue: a.modifiedCount, cleared: b.modifiedCount };
}

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Run multer and turn its errors into clean 400 responses
function handleUpload(req, res, next) {
  uploadBugScreenshots(req, res, err => {
    if (!err) return next();
    removeScreenshotFiles((req.files || []).map(f => f.filename));
    if (err.name === 'MulterError') {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Each screenshot must be 5 MB or smaller'
        : err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE' ? `You can attach at most ${MAX_FILES} screenshots`
        : err.message;
      return fail(res, 400, msg);
    }
    return fail(res, err.status || 400, err.message);
  });
}

function validateReport(body, { partial = false } = {}) {
  const errors = [];
  const out = {};
  const fields = {
    title: 200, description: 5000, affectedPage: 500, stepsToReproduce: 5000,
    expectedResult: 2000, actualResult: 2000, environment: 300
  };
  for (const [key, max] of Object.entries(fields)) {
    if (body[key] === undefined) continue;
    if (typeof body[key] === 'string' && body[key].trim().length > max) errors.push(`${key} is too long (max ${max} characters)`);
    out[key] = str(body[key], max);
  }
  if (body.severity !== undefined) {
    if (!SEVERITIES.includes(body.severity)) errors.push(`severity must be one of ${SEVERITIES.join(', ')}`);
    else out.severity = body.severity;
  }
  for (const req of ['title', 'description', 'affectedPage']) {
    if ((!partial || body[req] !== undefined) && !out[req]) errors.push(`${req} is required`);
  }
  return { errors, data: out };
}

async function findBugFor(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) { fail(res, 404, 'Bug not found'); return null; }
  const bug = await Bug.findById(id);
  // Testers only ever see their own reports; others look like "not found"
  if (!bug || (!isDeveloper(req) && bug.reportedBy !== req.user.username)) {
    fail(res, 404, 'Bug not found');
    return null;
  }
  return bug;
}

function applyCompletion(bug, by, now = new Date()) {
  bug.status = 'completed';
  bug.completedAt = now;
  bug.completedBy = by;
  bug.completedLate = now > bug.deadline;
  bug.overdue = false;
}

function clearCompletion(bug) {
  bug.completedAt = null;
  bug.completedBy = '';
  bug.completedLate = false;
}

// ─── Meta / Reports (developer) ─────────────────────────────────────────────

router.get('/meta', requireRole('developer'), async (req, res, next) => {
  try {
    const reporters = await Bug.distinct('reportedBy');
    const testers = [...new Set([...getAccounts('tester').map(a => a.username), ...reporters])].sort();
    return res.json({
      success: true,
      developers: getAccounts('developer').map(a => a.username),
      testers,
      priorities: PRIORITIES, statuses: STATUSES, severities: SEVERITIES
    });
  } catch (err) { return next(err); }
});

async function buildSummary(now = new Date()) {
  const in2days = new Date(now.getTime() + 2 * DAY_MS);
  const [total, open, inProgress, completed, overdue, completedLate, byPriority, bySeverity, byTester, dueSoon] =
    await Promise.all([
      Bug.countDocuments(),
      Bug.countDocuments({ status: 'open' }),
      Bug.countDocuments({ status: 'in-progress' }),
      Bug.countDocuments({ status: 'completed' }),
      Bug.countDocuments(overdueFilter(now)),
      Bug.countDocuments({ completedLate: true }),
      Bug.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Bug.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
      Bug.aggregate([
        {
          $group: {
            _id: '$reportedBy',
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            overdue: {
              $sum: { $cond: [{ $and: [{ $ne: ['$status', 'completed'] }, { $lt: ['$deadline', now] }] }, 1, 0] }
            }
          }
        },
        { $sort: { total: -1, _id: 1 } }
      ]),
      Bug.find({ status: { $ne: 'completed' }, deadline: { $gte: now, $lte: in2days } })
        .sort({ deadline: 1 })
        .select('bugNumber title deadline priority status reportedBy')
        .lean()
    ]);

  const toMap = (rows, keys) => Object.fromEntries(keys.map(k => [k, rows.find(r => r._id === k)?.count || 0]));
  return {
    generatedAt: now,
    total, open, inProgress, completed, overdue, completedLate,
    completedOnTime: completed - completedLate,
    byPriority: toMap(byPriority, PRIORITIES),
    bySeverity: toMap(bySeverity, SEVERITIES),
    byTester: byTester.map(r => ({ tester: r._id, total: r.total, completed: r.completed, overdue: r.overdue })),
    dueSoon: dueSoon.map(b => serializeBug(b, now))
  };
}

router.get('/reports/summary', requireRole('developer'), async (req, res, next) => {
  try {
    await syncOverdueFlags();
    return res.json({ success: true, summary: await buildSummary() });
  } catch (err) { return next(err); }
});

router.get('/reports/excel', requireRole('developer'), async (req, res, next) => {
  try {
    await syncOverdueFlags();
    const now = new Date();
    const bugs = (await Bug.find().sort({ submittedAt: -1 }).lean()).map(b => serializeBug(b, now));
    const summary = await buildSummary(now);
    const origin = `${req.protocol}://${req.get('host')}`;

    const { default: ExcelJS } = await import('exceljs'); // loaded on demand (large module)
    const wb = new ExcelJS.Workbook();
    wb.creator = `ZeniTEK Bug Tracker (${req.user.username})`;
    wb.created = now;

    const NAVY = 'FF123B92';
    const styleHeader = ws => {
      const row = ws.getRow(1);
      row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
      row.alignment = { vertical: 'middle', wrapText: true };
      row.height = 22;
      ws.views = [{ state: 'frozen', ySplit: 1 }];
    };

    const bugColumns = [
      { header: 'Bug #', key: 'bugNumber', width: 8 },
      { header: 'Title', key: 'title', width: 36 },
      { header: 'Affected Page', key: 'affectedPage', width: 28 },
      { header: 'Reported By', key: 'reportedBy', width: 16 },
      { header: 'Severity', key: 'severity', width: 11 },
      { header: 'Priority', key: 'priority', width: 11 },
      { header: 'Status', key: 'status', width: 13 },
      { header: 'Overdue', key: 'overdue', width: 10 },
      { header: 'Submitted At', key: 'submittedAt', width: 20, style: { numFmt: 'yyyy-mm-dd hh:mm' } },
      { header: 'Deadline', key: 'deadline', width: 20, style: { numFmt: 'yyyy-mm-dd hh:mm' } },
      { header: 'Days Remaining / Overdue', key: 'daysInfo', width: 24 },
      { header: 'Completed At', key: 'completedAt', width: 20, style: { numFmt: 'yyyy-mm-dd hh:mm' } },
      { header: 'Completed By', key: 'completedBy', width: 15 },
      { header: 'Completed Late', key: 'completedLate', width: 14 },
      { header: 'Assigned To', key: 'assignedTo', width: 15 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Steps to Reproduce', key: 'stepsToReproduce', width: 40 },
      { header: 'Expected Result', key: 'expectedResult', width: 30 },
      { header: 'Actual Result', key: 'actualResult', width: 30 },
      { header: 'Environment', key: 'environment', width: 22 },
      { header: 'Developer Notes', key: 'developerNotes', width: 40 },
      { header: 'Screenshots', key: 'screenshots', width: 60 },
      { header: 'Last Updated', key: 'updatedAt', width: 20, style: { numFmt: 'yyyy-mm-dd hh:mm' } }
    ];

    const daysInfo = b => {
      if (b.status === 'completed') return b.completedLate ? 'Completed late' : 'Completed on time';
      if (b.isOverdue) {
        const d = Math.max(1, Math.floor((now - new Date(b.deadline)) / DAY_MS));
        return `${d} day(s) overdue`;
      }
      return `${Math.max(0, Math.ceil((new Date(b.deadline) - now) / DAY_MS))} day(s) remaining`;
    };
    const toRow = b => ({
      ...b,
      bugNumber: b.bugNumber || '',
      overdue: b.isOverdue ? 'YES' : 'No',
      completedLate: b.status === 'completed' ? (b.completedLate ? 'Yes' : 'No') : '',
      daysInfo: daysInfo(b),
      completedAt: b.completedAt ? new Date(b.completedAt) : null,
      submittedAt: new Date(b.submittedAt),
      deadline: new Date(b.deadline),
      updatedAt: b.updatedAt ? new Date(b.updatedAt) : null,
      screenshots: (b.screenshots || []).map(s => origin + s.url).join('\n')
    });

    const addBugSheet = (name, list) => {
      const ws = wb.addWorksheet(name);
      ws.columns = bugColumns;
      list.forEach(b => {
        const row = ws.addRow(toRow(b));
        row.alignment = { vertical: 'top', wrapText: true };
        if (b.isOverdue) {
          row.eachCell({ includeEmpty: true }, cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE2E2' } };
            cell.font = { color: { argb: 'FFB91C1C' } };
          });
          row.getCell('overdue').font = { bold: true, color: { argb: 'FFB91C1C' } };
        }
      });
      styleHeader(ws);
      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: bugColumns.length } };
      return ws;
    };

    addBugSheet('All Bugs', bugs);

    const ws = wb.addWorksheet('Summary');
    ws.columns = [{ header: 'Metric', key: 'metric', width: 34 }, { header: 'Value', key: 'value', width: 18 }];
    const rows = [
      ['Report generated', now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'],
      ['Total bugs submitted', summary.total],
      ['Open', summary.open],
      ['In progress', summary.inProgress],
      ['Completed', summary.completed],
      ['Completed on time', summary.completedOnTime],
      ['Completed late', summary.completedLate],
      ['Overdue (not completed, past 7-day deadline)', summary.overdue],
      ['Due within 2 days', summary.dueSoon.length],
      ...PRIORITIES.map(p => [`Priority: ${p}`, summary.byPriority[p]]),
      ...SEVERITIES.map(s => [`Severity (tester): ${s}`, summary.bySeverity[s]])
    ];
    rows.forEach(([metric, value]) => ws.addRow({ metric, value }));
    ws.getRow(9).font = { bold: true, color: { argb: 'FFB91C1C' } };
    ws.addRow({});
    const testerHeader = ws.addRow({ metric: 'Bugs by tester', value: 'Total / Completed / Overdue' });
    testerHeader.font = { bold: true };
    summary.byTester.forEach(t => ws.addRow({ metric: t.tester, value: `${t.total} / ${t.completed} / ${t.overdue}` }));
    styleHeader(ws);
    ws.autoFilter = 'A1:B1';

    addBugSheet('Overdue', bugs.filter(b => b.isOverdue));
    addBugSheet('Completed', bugs.filter(b => b.status === 'completed'));

    const date = new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10); // IST date
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="zenitek-bug-report-${date}.xlsx"`);
    res.setHeader('Cache-Control', 'no-store');
    const buffer = await wb.xlsx.writeBuffer();
    return res.send(Buffer.from(buffer));
  } catch (err) { return next(err); }
});

// ─── List / Get ─────────────────────────────────────────────────────────────

router.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const query = {};
    if (!isDeveloper(req)) {
      query.reportedBy = req.user.username;
    } else if (req.query.tester) {
      query.reportedBy = String(req.query.tester);
    }
    const { status, priority, overdue, search } = req.query;
    if (status && STATUSES.includes(status)) query.status = status;
    if (priority && PRIORITIES.includes(priority)) query.priority = priority;
    if (overdue === 'true') {
      query.deadline = { $lt: now };
      if (!query.status) query.status = { $ne: 'completed' };
      else if (query.status === 'completed') query.status = { $in: [] }; // completed bugs are never overdue
    }
    if (overdue === 'false') query.$or = [{ status: 'completed' }, { deadline: { $gte: now } }];
    if (search && String(search).trim()) {
      const term = String(search).trim().slice(0, 100);
      const rx = new RegExp(escapeRegex(term), 'i');
      const or = [{ title: rx }, { description: rx }, { affectedPage: rx }, { reportedBy: rx }, { assignedTo: rx }];
      const num = Number(term.replace(/^#|^bug-?/i, ''));
      if (Number.isInteger(num) && num > 0) or.push({ bugNumber: num });
      query.$and = [...(query.$and || []), { $or: or }];
    }
    const bugs = await Bug.find(query).sort({ submittedAt: -1 }).limit(2000).lean();
    return res.json({ success: true, count: bugs.length, bugs: bugs.map(b => serializeBug(b, now)) });
  } catch (err) { return next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const bug = await findBugFor(req, res);
    if (!bug) return undefined;
    return res.json({ success: true, bug: serializeBug(bug) });
  } catch (err) { return next(err); }
});

// ─── Tester: create / edit / delete ─────────────────────────────────────────

router.post('/', requireRole('tester'), handleUpload, async (req, res, next) => {
  const files = req.files || [];
  try {
    const { errors, data } = validateReport(req.body || {});
    if (errors.length) {
      await removeScreenshotFiles(files.map(f => f.filename));
      return fail(res, 400, errors.join('; '));
    }
    const now = new Date();
    const bug = new Bug({
      ...data,
      bugNumber: await nextBugNumber(),
      screenshots: files.map(fileToScreenshot),
      reportedBy: req.user.username,
      submittedAt: now,
      history: [{ at: now, by: req.user.username, action: 'Reported', note: files.length ? `${files.length} screenshot(s) attached` : '' }]
    });
    await bug.save();
    return res.status(201).json({ success: true, message: 'Bug reported successfully', bug: serializeBug(bug) });
  } catch (err) {
    await removeScreenshotFiles(files.map(f => f.filename));
    return next(err);
  }
});

router.put('/:id', requireRole('tester'), handleUpload, async (req, res, next) => {
  const files = req.files || [];
  const cleanup = () => removeScreenshotFiles(files.map(f => f.filename));
  try {
    const bug = await findBugFor(req, res);
    if (!bug) { await cleanup(); return undefined; }
    if (bug.status === 'completed') {
      await cleanup();
      return fail(res, 409, 'This bug is already completed and can no longer be edited');
    }
    const { errors, data } = validateReport(req.body || {}, { partial: true });
    if (errors.length) { await cleanup(); return fail(res, 400, errors.join('; ')); }

    let removeIds = [];
    if (req.body.removeScreenshots) {
      try {
        const parsed = JSON.parse(req.body.removeScreenshots);
        removeIds = Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        removeIds = String(req.body.removeScreenshots).split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    const removed = bug.screenshots.filter(s => removeIds.includes(String(s._id)));
    const kept = bug.screenshots.filter(s => !removeIds.includes(String(s._id)));
    if (kept.length + files.length > MAX_FILES) {
      await cleanup();
      return fail(res, 400, `A bug can have at most ${MAX_FILES} screenshots`);
    }

    const changed = Object.keys(data).filter(k => String(bug[k] ?? '') !== String(data[k]));
    Object.assign(bug, data);
    bug.screenshots = [...kept, ...files.map(fileToScreenshot)];
    const notes = [];
    if (changed.length) notes.push(`Updated: ${changed.join(', ')}`);
    if (files.length) notes.push(`${files.length} screenshot(s) added`);
    if (removed.length) notes.push(`${removed.length} screenshot(s) removed`);
    if (notes.length) bug.history.push({ at: new Date(), by: req.user.username, action: 'Edited by tester', note: notes.join('; ') });
    await bug.save();
    await removeScreenshotFiles(removed.map(s => s.filename));
    return res.json({ success: true, message: 'Bug updated', bug: serializeBug(bug) });
  } catch (err) {
    await cleanup();
    return next(err);
  }
});

router.delete('/:id', requireRole('tester'), async (req, res, next) => {
  try {
    const bug = await findBugFor(req, res);
    if (!bug) return undefined;
    if (bug.status === 'completed') return fail(res, 409, 'Completed bugs cannot be deleted');
    await Bug.deleteOne({ _id: bug._id });
    await removeScreenshotFiles(bug.screenshots.map(s => s.filename));
    return res.json({ success: true, message: 'Bug deleted' });
  } catch (err) { return next(err); }
});

// ─── Developer: triage / progress / complete ────────────────────────────────

router.patch('/:id', requireRole('developer'), async (req, res, next) => {
  try {
    const bug = await findBugFor(req, res);
    if (!bug) return undefined;
    const { priority, status, assignedTo, developerNotes, note } = req.body || {};
    const by = req.user.username;
    const now = new Date();
    const log = (action, text = '') => bug.history.push({ at: now, by, action, note: text });

    if (priority !== undefined) {
      if (!PRIORITIES.includes(priority)) return fail(res, 400, `priority must be one of ${PRIORITIES.join(', ')}`);
      if (priority !== bug.priority) { log('Priority changed', `${bug.priority} → ${priority}`); bug.priority = priority; }
    }
    if (assignedTo !== undefined) {
      const name = str(assignedTo, 100);
      if (name && !getAccounts('developer').some(a => a.username === name)) return fail(res, 400, 'assignedTo must be a developer username');
      if (name !== bug.assignedTo) { log('Assignment changed', name ? `Assigned to ${name}` : 'Unassigned'); bug.assignedTo = name; }
    }
    if (developerNotes !== undefined) {
      const text = str(developerNotes, 5000);
      if (text !== bug.developerNotes) { bug.developerNotes = text; log('Developer notes updated'); }
    }
    if (status !== undefined) {
      if (!STATUSES.includes(status)) return fail(res, 400, `status must be one of ${STATUSES.join(', ')}`);
      if (status !== bug.status) {
        const from = bug.status;
        if (status === 'completed') {
          applyCompletion(bug, by, now);
          log('Marked as completed', bug.completedLate ? 'Completed after the 7-day deadline' : 'Completed on time');
        } else {
          if (from === 'completed') { clearCompletion(bug); log('Reopened', `completed → ${status}`); }
          else log('Status changed', `${from} → ${status}`);
          bug.status = status;
        }
      }
    }
    if (note !== undefined && str(note, 2000)) log('Progress note', str(note, 2000));

    bug.overdue = computeIsOverdue(bug, now);
    await bug.save();
    return res.json({ success: true, message: 'Bug updated', bug: serializeBug(bug, now) });
  } catch (err) { return next(err); }
});

router.post('/:id/complete', requireRole('developer'), async (req, res, next) => {
  try {
    const bug = await findBugFor(req, res);
    if (!bug) return undefined;
    if (bug.status === 'completed') return fail(res, 409, 'Bug is already completed');
    const now = new Date();
    applyCompletion(bug, req.user.username, now);
    const note = str(req.body?.note, 2000);
    bug.history.push({
      at: now, by: req.user.username, action: 'Marked as completed',
      note: [bug.completedLate ? 'Completed after the 7-day deadline' : 'Completed on time', note].filter(Boolean).join(' — ')
    });
    await bug.save();
    return res.json({ success: true, message: 'Bug marked as completed', bug: serializeBug(bug, now) });
  } catch (err) { return next(err); }
});

export default router;
