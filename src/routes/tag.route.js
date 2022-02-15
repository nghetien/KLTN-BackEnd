const express = require("express");
const router = express.Router();

const { TagController } = require("../controllers");
const { Tag } = require("../models");

router.get("", TagController.getAllTag);
router.post("", TagController.createTag);
router.delete("", TagController.deleteTag);

module.exports = router;