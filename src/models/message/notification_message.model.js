const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationMessage = new Schema({
    emailReceiver: {
        type: String
    },
    emailSender: {
        type: String,
    },
    isChecked: Boolean,
    status: Boolean,
}, {
    timestamps: true
});

module.exports = mongoose.model("NotificationMessage", NotificationMessage);