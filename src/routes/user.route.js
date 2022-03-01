const moment = require("moment");
const express = require("express");
const router = express.Router();

const { UserController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("", checkToken, UserController.getInfoUser);
router.get("/:email", UserController.profileUser);
router.get("/history/:email", UserController.historyUser);
router.put("",checkToken, UserController.editProfile);
router.put("/avatar",checkToken, UserController.editAvatarProfile);

module.exports = router;