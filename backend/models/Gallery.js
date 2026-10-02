import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'box_dryers',
      'tunnel_external',
      'tunnel_internal',
      'trays_produce',
      'engineering',
      'Other'
    ],
    trim: true
  },
  image: {
    url: { type: String, required: [true, 'Image URL is required'] },
    publicId: { type: String, required: [true, 'Cloudinary publicId is required'] },
    alt: { type: String, default: '' }
  },
  // Optional metadata fields matching the static data structure
  location: { type: String, trim: true, default: '' },
  state: { type: String, trim: true, default: '' },
  productModel: { type: String, trim: true, default: '' },
  capacity: { type: String, trim: true, default: '' },
  lat: { type: Number },
  lng: { type: Number },
  displayOrder: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

GallerySchema.index({ published: 1, displayOrder: 1 });
GallerySchema.index({ category: 1, published: 1 });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
