const { Conversation, Message } = require("../models");

class MessageController {
    async getMessageConversation(req, res) {
        try {
            const { conversationId } = req.params;
            const { email } = req.body;
            const findConversation = await Conversation.findById(conversationId).exec()
            if (findConversation &&
                (email === findConversation.members[0] || email === findConversation.members[1])
            ) {
                const findAllMess = await Message.find({
                    conversationId,
                }).exec()
                res.status(200).json({
                    status: true,
                    message: 'OKE',
                    data: findAllMess,
                });
            } else {
                res.status(403).json({
                    status: false,
                    message: "You dont have permission",
                    data: null,
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async createNewMessage(req, res) {
        try {
            const { conversationId } = req.params;
            const { email, text, type } = req.body;
            const messages = new Message({
                conversationId,
                sender: email,
                text,
                type
            });
            const createMessages = await messages.save()
            res.status(200).json({
                status: true,
                message: 'OKE',
                data: createMessages,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async editMessage(req, res) {
        try {
            const { email, text } = req.body;
            const { messageId } = req.params;
            const findMessage = await Message.findById(messageId).exec();
            if (findMessage && email === findMessage.sender) {
                findMessage.text = text;
                await findMessage.save();
                res.status(200).json({
                    status: true,
                    message: 'OKE',
                    data: findMessage,
                });
            } else {
                res.status(403).json({
                    status: false,
                    message: "You dont have permission",
                    data: null,
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async deleteMessage(req, res) {
        try {
            const { email } = req.body;
            const { messageId } = req.params;
            const findMessage = await Message.findById(messageId).exec();
            if (findMessage && email === findMessage.sender) {
                findMessage.type = 'system';
                await findMessage.save();
                res.status(200).json({
                    status: true,
                    message: 'OKE',
                    data: findMessage,
                });
            } else {
                res.status(403).json({
                    status: false,
                    message: "You dont have permission",
                    data: null,
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }
}

module.exports = new MessageController();