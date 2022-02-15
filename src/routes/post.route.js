const express = require("express");
const router = express.Router();

const { PostController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("", PostController.getAllPost);
router.get("/:idPost", PostController.getInfoPost);
router.post("", checkToken, PostController.createPost);

module.exports = router;