/**
 * Cloudinary Configuration Utility
 * ZeniTEK Backend - Image Storage
 */
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary with env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Product Images Storage
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'zenitek/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto:good' }]
  }
});

// Gallery Images Storage
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'zenitek/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1800, height: 1200, crop: 'limit', quality: 'auto:good' }]
  }
});

export const uploadProductImages = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

export const uploadGalleryImage = multer({
  storage: galleryStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

/**
 * Delete a Cloudinary image by its public_id
 * @param {string} publicId - Cloudinary public_id
 */
export async function deleteCloudinaryImage(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Cloudinary delete warning:', err.message);
  }
}

export default cloudinary;
