const express = require("express");
const router = express.Router();

const { PostController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("", PostController.getAllPost);
router.get("/manager", checkToken, PostController.managerPost);
router.get("/count-max-page", PostController.countMaxPagePost);
router.get("/find-all", PostController.findAllPost);
router.get("/:idPost", PostController.getInfoPost);
router.post("", checkToken, PostController.createPost);
router.put("/:idPost", checkToken, PostController.editPost);

module.exports = router;