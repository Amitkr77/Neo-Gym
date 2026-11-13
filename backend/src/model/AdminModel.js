import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
    // Note: `unique` was removed from fullname (two admins may share a name). Existing
    // databases keep the old `fullname_1` index until it is dropped manually — see AUDIT_REPORT DB-07.
    fullname: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters long'],
    },
    // bcrypt hash. Legacy plaintext values are upgraded on the next successful login.
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    }
}, {
    timestamps: true,
    toJSON: { transform: (_doc, ret) => { delete ret.password; return ret; } },
});

export const Admin = mongoose.model("Admin", adminSchema);
