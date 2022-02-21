const { Notification } = require("../models");

class NotificationController {
    async getAllNotification(req, res) {
        try {
            const { email } = req.body;
            const findAllNotification = await Notification.find({ emailReceiver: email }).exec();
            const newNotification = await Notification.find(
                { emailReceiver: email, isChecked: false }
            ).exec();
            res.status(200).json({
                status: true,
                message: "OKE",
                data: {
                    newNotification: newNotification.length,
                    allNotification: findAllNotification.sort((a, b) => a.createAt < b.createdAt ? 1 : -1),
                },
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async checkNotification(req, res) {
        try {
            const { idNotification } = req.params;
            const findNotification = await Notification.findByIdAndUpdate(idNotification, {
                isChecked: true
            }).exec();
            if (findNotification) {
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: null,
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: "Check notification failure",
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

module.exports = new NotificationController();