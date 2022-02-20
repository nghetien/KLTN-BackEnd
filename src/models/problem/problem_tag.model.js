const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProblemTag = new Schema(
    {
        idProblem: {
            type: String,
            required: "Id câu hỏi không được bỏ trống",
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

module.exports = mongoose.model("ProblemTag", ProblemTag);
