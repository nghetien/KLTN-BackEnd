const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema({
    emailReceiver: {
        type: String,
        required: "Email receiver không được bỏ trống",
    },
    emailSender: {
        type: String,
        required: "Email sender không được bỏ trống",
    },
    type: {
        type: String,
    },
    isChecked: Boolean,
    redirectUrl: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Notification", Notification);