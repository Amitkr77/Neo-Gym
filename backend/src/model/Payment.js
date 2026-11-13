import mongoose from 'mongoose';

export const PAYMENT_METHODS = ['cash', 'upi', 'card', 'bank_transfer', 'other'];

const paymentSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    // Snapshot of the member's name so receipts stay readable if the member is later deleted.
    memberName: { type: String, trim: true },
    amountPaid: { type: Number, required: true, min: [0, 'Amount cannot be negative'] },
    paymentDate: { type: Date, required: true, default: Date.now },
    // Optional: members who self-register have no service/plan yet but must still be billable.
    chosenService: { type: String, enum: ['Fitness', 'Sauna', 'Cardio'] },
    plan: { type: String, enum: ['premium', 'standard', 'basic'] },
    method: { type: String, enum: PAYMENT_METHODS, default: 'cash' },
    note: { type: String, trim: true, maxlength: 500 },
    invoiceNumber: { type: String, unique: true, sparse: true },
    // Client-generated key that makes "Record payment" safe to retry or double-click.
    idempotencyKey: { type: String, unique: true, sparse: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
