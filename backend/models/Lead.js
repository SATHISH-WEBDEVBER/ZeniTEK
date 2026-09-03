import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  whatsappPreference: { type: Boolean, default: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  clientType: {
    type: String,
    enum: ['Individual Farmer', 'FPO / Cooperative Group', 'Food Processor & Exporter', 'Industrial/Sludge Processor', 'NGO / CSR Partner'],
    required: true
  },
  cropType: {
    type: String,
    enum: ['Copra/Coconut', 'Moringa/Herbs', 'Spices/Chillies', 'Fruits/Veggies', 'Fish/Seafood', 'Other'],
    required: true
  },
  capacityNeeded: {
    type: String,
    enum: ['Under 50 kg (Portable)', '100 to 500 kg (Commercial)', '1 Ton+ (Industrial)'],
    required: true
  },
  message: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
