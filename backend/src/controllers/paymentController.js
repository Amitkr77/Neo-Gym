import Payment, { PAYMENT_METHODS } from '../model/Payment.js';
import Member, { MEMBER_STATUSES } from '../model/Member.js';
import { nextInvoiceNumber } from '../model/Counter.js';
import { isObjectId } from '../middleware/validate.js';
import { sendError } from '../utils/httpError.js';

// Record a payment (admin). Safe to retry: a repeated idempotencyKey returns the original record.
export const createPayment = async (req, res) => {
    const { memberId, amountPaid, paymentDate, method, note, idempotencyKey, memberStatus } = req.body || {};

    if (!isObjectId(memberId)) {
        return res.status(400).json({ message: 'A valid member is required' });
    }
    const amount = Number(amountPaid);
    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    const date = paymentDate ? new Date(paymentDate) : new Date();
    if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid payment date' });
    }
    if (method !== undefined && !PAYMENT_METHODS.includes(method)) {
        return res.status(400).json({ message: 'Invalid payment method' });
    }
    if (memberStatus !== undefined && !MEMBER_STATUSES.includes(memberStatus)) {
        return res.status(400).json({ message: 'Invalid member status' });
    }
    if (idempotencyKey !== undefined && (typeof idempotencyKey !== 'string' || idempotencyKey.length > 100)) {
        return res.status(400).json({ message: 'Invalid idempotency key' });
    }

    try {
        if (idempotencyKey) {
            const existing = await Payment.findOne({ idempotencyKey });
            if (existing) return res.status(200).json({ message: 'Payment already recorded', payment: existing, duplicate: true });
        }

        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const payment = await Payment.create({
            member: member._id,
            memberName: member.fullName,
            amountPaid: amount,
            paymentDate: date,
            chosenService: member.chosenService,
            plan: member.plan,
            method: method || 'cash',
            note,
            idempotencyKey,
            invoiceNumber: await nextInvoiceNumber(date),
            recordedBy: req.auth?.id,
        });

        // Keep the member's "last paid" date in sync. Status changes only when the admin
        // explicitly chooses one in the payment form; it is never changed implicitly.
        const memberUpdate = { paidDate: date };
        if (memberStatus) memberUpdate.status = memberStatus;
        await Member.updateOne({ _id: member._id }, memberUpdate);

        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        // Two concurrent requests with the same key: the loser returns the winner's record.
        if (error?.code === 11000 && error.keyPattern?.idempotencyKey) {
            const existing = await Payment.findOne({ idempotencyKey });
            return res.status(200).json({ message: 'Payment already recorded', payment: existing, duplicate: true });
        }
        sendError(res, error, 'Server error');
    }
};

const listPayments = (filter) =>
    Payment.find(filter).sort({ paymentDate: -1, createdAt: -1 }).populate('member', 'fullName username reminder');

// All payments (admin). Returns an empty list rather than 404 when there are none.
export const getAllPayment = async (_req, res) => {
    try {
        res.status(200).json({ payments: await listPayments({}) });
    } catch (error) {
        sendError(res, error);
    }
};

export const getPaymentsForMember = async (req, res) => {
    try {
        res.status(200).json({ payments: await listPayments({ member: req.params.memberId }) });
    } catch (error) {
        sendError(res, error);
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('member', 'fullName username contactNumber');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ payment });
    } catch (error) {
        sendError(res, error);
    }
};

// The logged-in member's own payment history.
export const getMyPayments = async (req, res) => {
    try {
        res.status(200).json({ payments: await listPayments({ member: req.auth.id }) });
    } catch (error) {
        sendError(res, error);
    }
};
