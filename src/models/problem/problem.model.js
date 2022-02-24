const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Problem = new Schema({
    email: {
        type: String,
        required: "Email không được bỏ trống",
    },
    nameProblem: {
        type: String,
        trim: true,
        required: "Tên câu hỏi không được bỏ trống",
        unique: true,
    },
    shortContent: String,
    content: {
        type: String,
        required: "Nội dung câu hỏi không được bỏ trống",
    },
    typeContent: String,
    timeCreate: Number,
    lastUpdate: Number,
    view: Number,
    isHaveCorrectAnswer: Boolean,
    status: Boolean,
});

module.exports = mongoose.model("Problem", Problem);