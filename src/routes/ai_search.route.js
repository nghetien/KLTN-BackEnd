const express = require("express");
const router = express.Router();

const { AISearchController } = require("../controllers");

router.post("", AISearchController.searchAllTag);
router.post("/add-tag-to-group", AISearchController.addTagToGroup);

module.exports = router;