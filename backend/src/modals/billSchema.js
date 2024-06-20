const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billProductSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  stockAmount: {
    type: Number,
    required: true,
    default: 1,
  },
  amount: {
    type: Number,
    default: 0,
  },
});

const billSchema = new Schema(
  {
    billNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["draft", "printed", "saved"],
      default: "draft",
    },
    operator: {
      type: Schema.Types.ObjectId, // Reference the client's ID
      ref: "operator", // Reference the Client model
      required: true,
    },
    items: [billProductSchema],
    client: {
      type: Schema.Types.ObjectId, // Reference the client's ID
      ref: "Client", // Reference the Client model
      required: true,
    },
    clientInfo: {
      clientID: {
        type: Number,
      },
      clientPhone: {
        type: String,
      },
      clientName: {
        type: String,
      },
      address: {
        type: String,
      },
      email: {
        type: String,
      },
      dateCreated: {
        type: Date,
      },
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
