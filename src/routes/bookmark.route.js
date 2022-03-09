const express = require("express");
const router = express.Router();

const { BookmarkController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("/post", checkToken, BookmarkController.getBookmarkPost);
router.get("/problem", checkToken, BookmarkController.getBookmarkProblem);
router.get("/:idObject", checkToken, BookmarkController.getBookmark);
router.post("/:idObject", checkToken, BookmarkController.toggleBookmark);


module.exports = router;