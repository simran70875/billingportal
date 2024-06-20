const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Function to get the next sequence value
async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
}

const clientSchema = new mongoose.Schema({
  clientID: { type: Number },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: "operator" },
  clientPhone: {
    type: String,
    required: true,
    unique: true,
  },
  clientName: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  totalBills: {
    type: Number,
    default: 0,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: Date.now, // Auto-save current date and time
  },
});

// Hook to set clientID after the client is saved
clientSchema.pre("save", async function (next) {
  if (!this.clientID) {
    this.clientID = await getNextSequenceValue("clientID");
  }
  next();
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
