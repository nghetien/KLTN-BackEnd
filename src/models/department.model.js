const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Department = new Schema({
    department_code: {
        type: String,
        trim: true,
        required: 'Department is required',
        unique: true,
    },
    description: String,
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', Department);