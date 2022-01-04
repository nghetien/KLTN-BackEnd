const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Major = new Schema({
    department_code: String,
    major_code: {
        type: String,
        trim: true,
        required: 'Major is required',
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

module.exports = mongoose.model('Major', Major);