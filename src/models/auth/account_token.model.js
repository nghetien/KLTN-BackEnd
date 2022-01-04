const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountToken = new Schema({
    email: String,
    token: String,
    time_create: Number,
    expiration_date: Number,
});

module.exports = mongoose.model('AccountToken', AccountToken);