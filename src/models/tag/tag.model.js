const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Tag = new Schema({
    content: {
        type: String,
        required: "Nội dung không được bỏ trống",
        unique: true,
    },
    status: Boolean,
}, {
    timestamps: true
});

module.exports = mongoose.model("Tag", Tag);