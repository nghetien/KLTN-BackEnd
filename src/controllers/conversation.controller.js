const { Conversation, Message, User } = require("../models");

class ConversationController {
    async getAllConversation(req, res) {
        try {
            const { email } = req.body;
            const conversation = await Conversation.find({
                members: { $in: [email] },
            }, {}, { sort: { 'createdAt': -1 } });
            for (let i = 0; i < conversation.length; i++) {
                const lastMessage = await Message.findOne({
                    conversationId: conversation[i]._id.toString()
                }, {}, { sort: { 'createdAt': -1 } }).exec();
                const emailParticipant = email !== conversation[i].members[0] ?
                    conversation[i].members[0] :
                    conversation[i].members[1];
                const findUser = await User.findOne({ email: emailParticipant }).exec();
                const avatarParticipant = findUser.avatar;
                const defaultValue = conversation[i]._doc;
                conversation[i] = {
                    ...defaultValue,
                    lastMessage,
                    emailParticipant,
                    avatarParticipant,
                }
            }
            res.status(200).json({
                status: true,
                message: 'OKE',
                data: conversation.sort(
                    (a, b) => {
                        if (
                            a.lastMessage &&
                            a.lastMessage.createdAt
                        ) {
                            if (
                                b.lastMessage &&
                                b.lastMessage.createdAt
                            ) {
                                if (a.lastMessage.createdAt < b.lastMessage.createdAt) {
                                    return 1;
                                }
                                return -1;
                            }
                            return -1;
                        }
                        return 1;
                    }
                ),
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async createConversation(req, res) {
        try {
            const { email, emailParticipant } = req.body;
            const newConversation = new Conversation({
                members: [
                    email,
                    emailParticipant,
                ]
            })
            const createNewConversation = await newConversation.save();
            res.status(200).json({
                status: true,
                message: 'OKE',
                data: createNewConversation,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }
}

module.exports = new ConversationController();