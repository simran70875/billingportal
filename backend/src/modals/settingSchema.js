const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  tax: { type: Number, default: 10 },
  shopName: { type: String },
  phone: { type: Number },
  address: { type: String },
  email: { type: String },
  copyright: { type: String },
  logo: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId },
  role: { type: String },
});

module.exports = mongoose.model("settings", settingSchema);
