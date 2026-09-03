import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  location: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  comment: { type: String, required: true },
  videoUrl: { type: String },
  approved: { type: Boolean, default: false }
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
