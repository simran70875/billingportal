const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  role: { type: String, required: true, default:"superAdmin"},
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("admin", adminSchema);
