const moment = require("moment");

const { AccountToken } = require("../models");

const checkToken = async function (req, res, next) {
    const { token } = req.headers;
    const findTokenAndUpdate = await AccountToken.findOneAndUpdate(
        {
            token,
        },
        {
            time_create: moment().unix(),
            expiration_date: moment().unix() + 30 * 24 * 60 * 60,
        }
    );
    if (findTokenAndUpdate) {
        req.body.email = findTokenAndUpdate.email;
        next()
    } else {
        res.status(401).json({
            status: false,
            message: "Token is out of expiration date",
            data: "",
        });
    }
}

module.exports = checkToken;