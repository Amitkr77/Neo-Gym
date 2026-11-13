import mongoose from "mongoose";

// Atomic sequence generator (one document per named sequence).
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

export const nextSequence = async (name) => {
  const doc = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
};

// Persistent, sequential invoice numbers, e.g. NG-2026-000042.
export const nextInvoiceNumber = async (date = new Date()) => {
  const seq = await nextSequence("invoice");
  return `NG-${date.getFullYear()}-${String(seq).padStart(6, "0")}`;
};

export default Counter;
