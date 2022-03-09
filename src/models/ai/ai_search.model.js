const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AISearch = new Schema({
    group: {
        type: Object,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("AISearch", AISearch);