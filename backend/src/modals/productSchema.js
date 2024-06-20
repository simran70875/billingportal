const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: "operator" },
  productName: {
    type: String,
    required: true,
  },
  variationName: String,
  shortDescription: String,
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: Number,
  barcode: String,
  stockAmount: {
    type: Number,
    required: true,
    default: 1,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
