const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const AccountToken = require("../models/auth/account_token.model");

const checkToken = async function (req, res, next) {
    const { token } = req.headers;
    const findAccountToken = await AccountToken.findOne({
        token
    }).exec();
    if(findAccountToken){
        req.email = findAccountToken.email;
        next()
    }else{
        res.status(401).json({
            status: false,
            message: "Token is out of expiration date",
            data: "",
        });
    }
}

router.get("", checkToken, userController.getInfoUser);

module.exports = router;