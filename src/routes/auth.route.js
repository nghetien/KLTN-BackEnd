const express = require("express");
const router = express.Router();

const authenticationController = require("../controllers/auth.controller");

const checkEmailAndPassword = function (req, res, next) {
    const { email, password } = req.body;
    if (email && password) {
        next();
    } else {
        res.status(400).json({
            status: false,
            message: email.length === 0 ? "Email is empty" : "Password is empty",
            data: null,
        });
    }
};

router.post("/login", checkEmailAndPassword, authenticationController.login, authenticationController.getTokenUser);
router.post("/login_google", authenticationController.loginGoogle, authenticationController.getTokenUser);
router.post("/register", authenticationController.register);
router.delete("/logout", authenticationController.logout);

module.exports = router;
