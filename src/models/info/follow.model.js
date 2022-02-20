const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Follow = new Schema({
    email: {
        type: String,
        required: 'Email is required',
    },
    emailUserFollow: {
        type: String,
        required: 'Email user follow is required',
    },
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Follow', Follow);