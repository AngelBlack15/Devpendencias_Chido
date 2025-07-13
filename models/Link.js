// models/Link.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: String,
  image:       String,
  url:         { type: String, required: true, trim: true },
  tags:        [String]
}, { timestamps: true });

export default mongoose.model('Link', schema);
