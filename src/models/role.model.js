const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = new Schema({
    role: {
        type: String,
        trim: true,
        unique: true,
        required: 'Role is required',
    },
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', Role);