const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostTag = new Schema(
    {
        idPost: {
            type: String,
            required: "Id post không được bỏ trống",
        },
        idTag: {
            type: String,
            required: "Id tag không được bỏ trống",
        },
        status: Boolean,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PostTag", PostTag);
