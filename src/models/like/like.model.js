const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Like = new Schema(
    {
        type: {
            type: String,
            required: "Kiểu không được bỏ trống",
        },
        email: {
            type: String,
            required: "Email không được bỏ trống",
        },
        idObject: {
            type: String,
            required: "Id đối tượng không được bỏ trống",
        },
        isLike: Boolean,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Like", Like);
