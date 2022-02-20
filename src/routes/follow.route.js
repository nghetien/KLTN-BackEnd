const express = require("express");
const router = express.Router();

const { FollowController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("/:emailUserFollow", checkToken, FollowController.getFollow);
router.post("/", checkToken, FollowController.toggleFollowUser);

module.exports = router;