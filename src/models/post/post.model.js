const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema({
    email: {
        type: String,
        required: "Email không được bỏ trống",
    },
    namePost: {
        type: String,
        trim: true,
        required: "Tên post không được bỏ trống",
    },
    shortContent: String,
    content: {
        type: String,
        required: "Nội dung post không được bỏ trống",
    },
    typeContent: String,
    timeCreate: Number,
    lastUpdate: Number,
    view: Number,
    status: Boolean,
    statusPost: String,
});

module.exports = mongoose.model("Post", Post);
