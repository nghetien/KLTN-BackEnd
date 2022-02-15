const express = require("express");
const router = express.Router();

const { CommentController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("/:type/:idObject", CommentController.getComment);
router.post("", checkToken, CommentController.createComment);
router.put("", checkToken, CommentController.editComment);
router.delete("/:type/:idObjectComment", checkToken, CommentController.deleteComment);

module.exports = router;