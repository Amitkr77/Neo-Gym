import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true, maxlength: 60 },
        lastName: { type: String, required: true, trim: true, maxlength: 60 },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 120,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        phone: { type: String, trim: true, maxlength: 20 },
        message: { type: String, required: true, trim: true, maxlength: 2000 },
    },
    { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", contactSchema);

export default ContactUs;
