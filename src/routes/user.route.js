const moment = require("moment");
const express = require("express");
const router = express.Router();

const { UserController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("", checkToken, UserController.getInfoUser);

module.exports = router;