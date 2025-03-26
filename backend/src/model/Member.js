    // import mongoose from "mongoose";

    // const addressSchema = new mongoose.Schema({
    //     street: {
    //         type: String,
    //         required: true,
    //     },
    //     city: {
    //         type: String,
    //         required: true,
    //     },
    //     state: {
    //         type: String,
    //         required: true,
    //     },
    //     zipCode: {
    //         type: String,
    //         required: true,
    //     },
    // }, { _id: false }); // Prevent creating an _id for subdocuments

    // const MemberSchema = new mongoose.Schema({
    //     fullName: {
    //         type: String,
    //         required: true,
    //     },
    //     username: {
    //         type: String,
    //         required: true,
    //         unique: true,
    //         trim: true, // Trims whitespace
    //     },
    //     gender: {
    //         type: String,
    //         enum: ['male', 'female', 'other'],
    //         required: true,
    //     },
    //     contactNumber: {
    //         type: String,
    //         required: true,
    //         match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number.'],
    //     },
    //     dateOfRegistration: {
    //         type: Date,
    //         required: false,
    //         default: Date.now,
    //     },
    //     address: {
    //         type: addressSchema,
    //         required: true,
    //     },
    //     amount: {
    //         type: Number,
    //         required: false,
    //         min: 0,
    //     },
    //     chosenService: {
    //         type: String,
    //         enum: ['Fitness', 'Sauna', 'Cardio'],
    //         required: false,
    //     },
    //     plan: {
    //         type: String,
    //         enum: ['premium', 'standard', 'basic'],
    //         required: false,
    //     },
    //     password: {
    //         type: String,
    //         required: true,
    //         minlength: 6,
    //     },
    //     status: {
    //         type: String,
    //         enum: ['Active', 'Expired', 'Pending'],
    //         required: true,
    //     },
    //     attendanceCount: {
    //         type: Number,
    //         default: 0,
    //     },
    //     initialWeight: {
    //         type: Number,
    //         default: 0,
    //     },
    //     currentWeight: {
    //         type: Number,
    //         default: 0,
    //     },
    //     initialBodyType: {
    //         type: String,
    //         default: '', // Can be values like 'Slim', 'Fat', etc.
    //     },
    //     currentBodyType: {
    //         type: String,
    //         default: '', // Can be values like 'Buffed', 'Bulked', etc.
    //     },
    //     progressDate: {
    //         type: Date,
    //         default: null, // This will store the date of last progress update
    //     },
    //     reminder: {
    //         type: Boolean,
    //         default: false,
    //     },
    //     paidDate: {
    //         type: Date,
    //         default: null,
    //     },
    
    // }, { timestamps: true });

    // // Optional: Index on username for faster lookup
    // MemberSchema.index({ username: 1 });

    // const Member = mongoose.model('Member', MemberSchema);
    // export default Member;


    import mongoose from "mongoose";
import Payment from "./Payment.js"; // Assuming Payment schema is in the same directory

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
    },
}, { _id: false }); // Prevent creating an _id for subdocuments

const MemberSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Trims whitespace
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number.'],
    },
    dateOfRegistration: {
        type: Date,
        required: false,
        default: Date.now,
    },
    address: {
        type: addressSchema,
        required: true,
    },
    amount: {
        type: Number,
        required: false,
        min: 0,
    },
    chosenService: {
        type: String,
        enum: ['Fitness', 'Sauna', 'Cardio'],
        required: false,
    },
    plan: {
        type: String,
        enum: ['premium', 'standard', 'basic'],
        required: false,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Pending'],
        required: true,
    },
    attendanceCount: {
        type: Number,
        default: 0,
    },
    initialWeight: {
        type: Number,
        default: 0,
    },
    currentWeight: {
        type: Number,
        default: 0,
    },
    initialBodyType: {
        type: String,
        default: '', // Can be values like 'Slim', 'Fat', etc.
    },
    currentBodyType: {
        type: String,
        default: '', // Can be values like 'Buffed', 'Bulked', etc.
    },
    progressDate: {
        type: Date,
        default: null, // This will store the date of last progress update
    },
    reminder: {
        type: Boolean,
        default: false,
    },
    paidDate: {
        type: Date,
        default: null,
    },

}, { timestamps: true });

// Optional: Index on username for faster lookup
MemberSchema.index({ username: 1 });

// Add a post-save hook to create the initial payment when a new member is saved
MemberSchema.post('save', async function(doc) {
    try {
        // Check if the member has an initial plan and service selected
        if (doc.plan && doc.chosenService) {
            // Create the payment with initial values
            const initialPayment = new Payment({
                member: doc._id,
                amountPaid: doc.amount || 0,  // Assuming member's amount represents initial payment
                paymentDate: doc.dateOfRegistration,
                chosenService: doc.chosenService,
                plan: doc.plan,
                reminderSent: false,
            });

            // Save the payment document
            await initialPayment.save();
            console.log(`Initial payment created for member ${doc.fullName}`);
        }
    } catch (error) {
        console.error('Error creating initial payment:', error);
    }
});

const Member = mongoose.model('Member', MemberSchema);
export default Member;
