const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  rentAmount: Number,
  bedrooms: Number,
  description: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["available", "occupied"], default: "available" },
  isApproved: { type: Boolean, default: false },
  verificationNotes: String,
  approvedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Property", propertySchema);
