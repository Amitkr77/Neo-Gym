// models/ContactUs.js
import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        phone: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", contactSchema);

export default ContactUs;
