const express = require("express");
const router = express.Router();

const { ConversationController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("", checkToken, ConversationController.getAllConversation);
router.post("", checkToken, ConversationController.createConversation);

module.exports = router;