import mongoose from 'mongoose';

const ProductImageSchema = new mongoose.Schema({
  url: { type: String, required: true },         // Cloudinary secure_url
  publicId: { type: String, required: true },    // Cloudinary public_id for deletion
  alt: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false }
}, { _id: true });

const SpecificationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Tunnel Type', 'Box Type', 'Solar Thermal', 'Accessories', 'Other'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  description: {
    type: String,
    trim: true
  },
  images: [ProductImageSchema],
  features: [{ type: String, trim: true }],
  specifications: [SpecificationSchema],
  displayOrder: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true  // createdAt + updatedAt automatically managed
});

// Text index for search
ProductSchema.index({ name: 'text', shortDescription: 'text', category: 'text' });
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ published: 1, displayOrder: 1 });

// Auto-generate slug from name if not provided
ProductSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
