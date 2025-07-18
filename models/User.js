import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model('Administrator', adminSchema);
