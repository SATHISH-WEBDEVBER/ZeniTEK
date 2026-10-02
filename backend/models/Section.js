import mongoose from 'mongoose';

const SectionImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' }
}, { _id: true });

const SectionSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [500, 'Subtitle cannot exceed 500 characters'],
    default: ''
  },
  thumbnail: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' }
  },
  // Rich page content (paragraphs / formatted text)
  content: {
    type: String,
    default: ''
  },
  // Key highlights / bullet points shown on the page
  highlights: [{ type: String, trim: true }],
  // Additional images for the page body gallery
  images: [SectionImageSchema],
  displayOrder: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

SectionSchema.index({ published: 1, displayOrder: 1 });

export default mongoose.models.Section || mongoose.model('Section', SectionSchema);

