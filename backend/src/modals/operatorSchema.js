const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["admin", "operator", "productAdmin"],
    default: "operator",
  },
  adminId: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  userid: { type: String, required: true },
  password: { type: String, required: true },
  createdDate: { type: Date, required: true, default: Date.now },
  status: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("operator", operatorSchema);
