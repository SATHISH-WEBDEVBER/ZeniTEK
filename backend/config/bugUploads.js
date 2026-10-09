/**
 * Local disk storage for bug-report screenshots: backend/uploads/bugs/
 * Served statically at /uploads/bugs/<file>
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

export const BUG_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'bugs');
export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

fs.mkdirSync(BUG_UPLOAD_DIR, { recursive: true });

const ALLOWED = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif'
};
const ALLOWED_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, BUG_UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `bug-${crypto.randomBytes(16).toString('hex')}${ALLOWED[file.mimetype]}`)
});

export const uploadBugScreenshots = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (ALLOWED[file.mimetype] && ALLOWED_EXT.includes(ext)) return cb(null, true);
    const err = new Error('Only PNG, JPG, WEBP or GIF images are allowed');
    err.status = 400;
    return cb(err, false);
  }
}).array('screenshots', MAX_FILES);

export function fileToScreenshot(file) {
  return { url: `/uploads/bugs/${file.filename}`, filename: file.filename, originalName: (file.originalname || '').slice(0, 200) };
}

/** Delete stored screenshot files; ignores missing files and anything outside the bug folder */
export async function removeScreenshotFiles(filenames = []) {
  await Promise.all(
    filenames.filter(Boolean).map(async name => {
      const safe = path.basename(name);
      try { await fs.promises.unlink(path.join(BUG_UPLOAD_DIR, safe)); } catch { /* already gone */ }
    })
  );
}
