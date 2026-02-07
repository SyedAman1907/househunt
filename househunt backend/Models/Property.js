const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  rentAmount: Number,
  bedrooms: Number,
  description: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' }
});
module.exports = mongoose.model('Property', propertySchema);