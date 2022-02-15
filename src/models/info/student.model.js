const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Student = new Schema({
    email: String,
    student_code: {
        type: String,
        trim: true,
        required: 'Student code is required',
        unique: true,
    },
    department: String,
    major: String,
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', Student);