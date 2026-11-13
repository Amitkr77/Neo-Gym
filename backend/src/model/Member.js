import mongoose from "mongoose";
import Payment from "./Payment.js";
import { hashPassword, isBcryptHash } from "../utils/password.js";
import { nextInvoiceNumber } from "./Counter.js";

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
}, { _id: false });

export const SERVICES = ['Fitness', 'Sauna', 'Cardio'];
export const PLANS = ['premium', 'standard', 'basic'];
export const MEMBER_STATUSES = ['Active', 'Expired', 'Pending'];

const MemberSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    contactNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number.'],
    },
    dateOfRegistration: { type: Date, default: Date.now },
    address: { type: addressSchema, required: true },
    amount: { type: Number, min: 0 },
    chosenService: { type: String, enum: SERVICES },
    plan: { type: String, enum: PLANS },
    // Never returned by queries unless explicitly selected with '+password'.
    password: { type: String, required: true, minlength: 6, select: false },
    status: { type: String, enum: MEMBER_STATUSES, required: true },
    attendanceCount: { type: Number, default: 0, min: 0 },
    initialWeight: { type: Number, default: 0, min: 0 },
    currentWeight: { type: Number, default: 0, min: 0 },
    initialBodyType: { type: String, default: '' },
    currentBodyType: { type: String, default: '' },
    progressDate: { type: Date, default: null },
    reminder: { type: Boolean, default: false },
    paidDate: { type: Date, default: null },
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            delete ret.password;
            return ret;
        },
    },
});

// Hash plaintext passwords on create/change. Already-hashed values are left alone.
MemberSchema.pre('save', async function () {
    this.$locals.wasNew = this.isNew;
    if (this.isModified('password') && !isBcryptHash(this.password)) {
        this.password = await hashPassword(this.password);
    }
});

// Create the initial payment record only when a member is first created with a plan
// (previously this ran on every save, which would duplicate payments).
MemberSchema.post('save', async function (doc) {
    if (!doc.$locals.wasNew || !doc.plan || !doc.chosenService) return;
    try {
        await Payment.create({
            member: doc._id,
            memberName: doc.fullName,
            amountPaid: doc.amount || 0,
            paymentDate: doc.paidDate || doc.dateOfRegistration,
            chosenService: doc.chosenService,
            plan: doc.plan,
            note: 'Initial payment recorded at registration',
            invoiceNumber: await nextInvoiceNumber(),
        });
    } catch (error) {
        console.error('Error creating initial payment:', error);
    }
});

const Member = mongoose.model('Member', MemberSchema);
export default Member;
