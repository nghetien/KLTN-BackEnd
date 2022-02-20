const express = require("express");
const router = express.Router();

const { MessController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("/:conversationId", checkToken, MessController.getMessageConversation);
router.post("/:conversationId", checkToken, MessController.createNewMessage);
router.put("/:messageId", checkToken, MessController.editMessage);
router.delete("/:messageId", checkToken, MessController.deleteMessage);

module.exports = router;