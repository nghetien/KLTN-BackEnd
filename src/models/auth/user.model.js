const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: String,
    full_name: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
    phone_number: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        trim: true,
        required: "Chức vụ không được bỏ trống"
    },
    department_code: String,
    major_code: String,
    student_code: {
        type: String,
        trim: true,
    },
    address: String,
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', User);