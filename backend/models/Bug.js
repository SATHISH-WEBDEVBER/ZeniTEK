import mongoose from 'mongoose';

export const DEADLINE_DAYS = 7;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const SEVERITIES = ['low', 'medium', 'high', 'critical'];
export const PRIORITIES = ['unset', 'low', 'medium', 'high', 'critical'];
export const STATUSES = ['open', 'in-progress', 'completed'];
export const CATEGORIES = [
  'ui-design', 'functionality', 'content-text', 'translation', 'performance',
  'broken-link', 'image-media', 'form', 'mobile-responsive', 'other'
];
export const REPRODUCIBILITY = ['always', 'sometimes', 'once', 'unable'];
export const REPORTER_ROLES = ['tester', 'client'];
export const DEVICE_TYPES = ['desktop', 'tablet', 'mobile'];

const screenshotSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, default: '' }
  },
  { _id: true }
);

const historySchema = new mongoose.Schema(
  {
    at: { type: Date, default: Date.now },
    by: { type: String, required: true },
    action: { type: String, required: true },
    note: { type: String, default: '' }
  },
  { _id: false }
);

// Technical details captured automatically by the reporter's browser
const contextSchema = new mongoose.Schema(
  {
    url: { type: String, default: '', maxlength: 1000 },
    path: { type: String, default: '', maxlength: 500 },
    pageTitle: { type: String, default: '', maxlength: 300 },
    browser: { type: String, default: '', maxlength: 100 },
    os: { type: String, default: '', maxlength: 100 },
    deviceType: { type: String, enum: [...DEVICE_TYPES, ''], default: '' },
    screen: { type: String, default: '', maxlength: 40 },
    viewport: { type: String, default: '', maxlength: 40 },
    pixelRatio: { type: Number, default: null },
    language: { type: String, default: '', maxlength: 20 },
    scroll: { type: String, default: '', maxlength: 40 },
    online: { type: Boolean, default: null },
    userAgent: { type: String, default: '', maxlength: 500 },
    consoleErrors: { type: [String], default: [] },
    capturedAt: { type: Date, default: null }
  },
  { _id: false }
);

const bugSchema = new mongoose.Schema(
  {
    bugNumber: { type: Number, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    affectedPage: { type: String, required: true, trim: true, maxlength: 500 },
    stepsToReproduce: { type: String, default: '', trim: true, maxlength: 5000 },
    expectedResult: { type: String, default: '', trim: true, maxlength: 2000 },
    actualResult: { type: String, default: '', trim: true, maxlength: 2000 },
    severity: { type: String, enum: SEVERITIES, default: 'medium' },
    environment: { type: String, default: '', trim: true, maxlength: 300 },
    category: { type: String, enum: [...CATEGORIES, ''], default: '' },
    reproducibility: { type: String, enum: [...REPRODUCIBILITY, ''], default: '' },
    affectedElement: { type: String, default: '', trim: true, maxlength: 300 },
    suggestedFix: { type: String, default: '', trim: true, maxlength: 2000 },
    context: { type: contextSchema, default: () => ({}) },
    screenshots: { type: [screenshotSchema], default: [] },
    reportedBy: { type: String, required: true, index: true },
    reporterRole: { type: String, enum: REPORTER_ROLES, default: 'tester', index: true },

    priority: { type: String, enum: PRIORITIES, default: 'unset', index: true },
    status: { type: String, enum: STATUSES, default: 'open', index: true },
    assignedTo: { type: String, default: '' },
    developerNotes: { type: String, default: '', maxlength: 5000 },
    history: { type: [historySchema], default: [] },

    submittedAt: { type: Date, default: Date.now },
    deadline: { type: Date, index: true },
    completedAt: { type: Date, default: null },
    completedBy: { type: String, default: '' },
    completedLate: { type: Boolean, default: false },
    overdue: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

bugSchema.pre('validate', function setDeadline(next) {
  if (!this.submittedAt) this.submittedAt = new Date();
  if (!this.deadline) this.deadline = new Date(this.submittedAt.getTime() + DEADLINE_DAYS * DAY_MS);
  next();
});

/** Live overdue check: not completed and past the deadline */
export function computeIsOverdue(bug, now = new Date()) {
  return bug.status !== 'completed' && !!bug.deadline && now > new Date(bug.deadline);
}

/** Plain object with computed fields added for API responses */
export function serializeBug(doc, now = new Date()) {
  const bug = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  const isOverdue = computeIsOverdue(bug, now);
  const msLeft = bug.deadline ? new Date(bug.deadline).getTime() - now.getTime() : 0;
  if (!bug.reporterRole) bug.reporterRole = 'tester'; // reports created before roles were recorded
  bug.isOverdue = isOverdue;
  bug.displayStatus = isOverdue ? 'overdue' : bug.status;
  // Positive = days remaining, negative = days overdue (only meaningful when not completed)
  bug.daysRemaining = bug.status === 'completed' ? null : Math.ceil(msLeft / DAY_MS);
  bug.hoursRemaining = bug.status === 'completed' ? null : Math.floor(msLeft / (60 * 60 * 1000));
  delete bug.__v;
  return bug;
}

bugSchema.index({ title: 'text', description: 'text', affectedPage: 'text' });

const Bug = mongoose.model('Bug', bugSchema);
export default Bug;
