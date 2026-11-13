import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
        // Accepts Indian 6-digit PIN codes and US ZIP / ZIP+4.
        match: [/^(\d{6}|\d{5}(-\d{4})?)$/, 'Please enter a valid PIN / ZIP code.'],
    },
}, { _id: false });

const GENDER_ENUM = ['male', 'female', 'other'];
const DESIGNATION_ENUM = ['cashier', 'trainer', 'manager'];

const staffSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, 
        index: true, 
    },
    gender: {
        type: String,
        enum: GENDER_ENUM,
    },
    designation: {
        type: String,
        enum: DESIGNATION_ENUM,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        index: true, 
        match: [/.+@.+\..+/, 'Please enter a valid email address.'], 
    },
    address: {
        type: addressSchema,
        required: true,
    },
    contact: {
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10,15}$/.test(v); 
            },
            message: props => `${props.value} is not a valid contact number!`
        }
    },
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
