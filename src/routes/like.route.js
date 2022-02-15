const express = require("express");
const router = express.Router();

const { LikeController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("/:idObject", checkToken, LikeController.getLike);
router.post("/:idObject", checkToken, LikeController.setLikeOrDislike);

module.exports = router;