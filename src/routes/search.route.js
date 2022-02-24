const express = require("express");
const router = express.Router();

const { SearchController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("", checkToken, SearchController.search);

module.exports = router;