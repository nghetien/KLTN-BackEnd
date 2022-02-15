const express = require("express");
const router = express.Router();

const { AuthController } = require("../controllers");
const { checkEmailAndPassword } = require("../middleware");

router.post("/login", checkEmailAndPassword, AuthController.login, AuthController.getTokenUser);
router.post("/login_google", AuthController.loginGoogle, AuthController.getTokenUser);
router.post("/register", AuthController.register);
router.delete("/logout", AuthController.logout);

module.exports = router;
