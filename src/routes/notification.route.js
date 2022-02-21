const express = require("express");
const router = express.Router();

const { NotificationController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("/", checkToken, NotificationController.getAllNotification);
router.post("/:idNotification", checkToken, NotificationController.checkNotification);

module.exports = router;