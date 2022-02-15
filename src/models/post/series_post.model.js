const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeriesPost = new Schema({
    idSeries: {
        type: String,
        trim: true,
        required: "Id không được bỏ trống",
    },
    nameSeries: {
        type: String,
        trim: true,
        required: "Tên series không được bỏ trống",
    },
    listPost: {
        type: Array,
        required: "Series không được bỏ trống",
    },
    status: Boolean,
    statusSeries: String,
});

module.exports = mongoose.model("SeriesPost", SeriesPost);
