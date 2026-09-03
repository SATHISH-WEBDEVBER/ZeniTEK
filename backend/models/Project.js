import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  cropDrying: { type: String, required: true },
  dryerType: { type: String, required: true },
  capacity: { type: String, required: true },
  imageUrl: { type: String },
  description: { type: String }
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
