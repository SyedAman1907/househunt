const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["renter", "owner", "admin", "subadmin"], default: "renter" },
  isApproved: { type: Boolean, default: false },
  mobile: String,
  address: String,
  image: String,
  otp: String,
  otpExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date
});
module.exports = mongoose.model("User", userSchema);
