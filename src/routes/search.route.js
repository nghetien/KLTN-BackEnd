const express = require("express");
const router = express.Router();

const { SearchController } = require("../controllers");
const { checkToken } = require("../middleware");

/// search post and problem
router.get("", checkToken, SearchController.search);
router.get("/user", checkToken, SearchController.searchUser);

module.exports = router;