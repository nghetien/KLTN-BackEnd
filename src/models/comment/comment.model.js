const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
    {
        type: {
            type: String,
            required: "Kiểu không được bỏ trống",
        },
        idParent: String,
        content: {
            type: String,
            required: "Nội dung không được bỏ trống",
        },
        status: Boolean,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment", Comment);
