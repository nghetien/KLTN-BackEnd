const express = require("express");
const router = express.Router();

const { NotificationMessageController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("/", checkToken, NotificationMessageController.getAllNotification);
router.post("/", checkToken, NotificationMessageController.checkNotification);

module.exports = router;