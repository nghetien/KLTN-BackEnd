const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostComment = new Schema(
    {
        idPost: {
            type: String,
            required: "Id post không được bỏ trống",
        },
        email: {
            type: String,
            required: "Email không được bỏ trống",
        },
        idComment: {
            type: String,
            required: "Id bình luận không được bỏ trống",
        },
        status: Boolean,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PostComment", PostComment);
