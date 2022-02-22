const { NotificationMessage } = require("../models");

class NotificationMessageController {
    async getAllNotification(req, res) {
        try {
            const { email } = req.body;
            const findNotification = await NotificationMessage.find({
                emailReceiver: email,
                isChecked: false,
            }).exec();
            res.status(200).json({
                status: true,
                message: 'OKE',
                data: findNotification,
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
            const { email, emailReceiver, idNotification } = req.body;
            console.log({ email, emailReceiver, idNotification });
            if(idNotification){
                const checkNotification = await NotificationMessage.findByIdAndUpdate(
                    idNotification,
                    {
                        isChecked: true,
                    }
                ).exec();
                res.status(200).json({
                    status: true,
                    message: 'OKE',
                    data: checkNotification,
                });
            }else{
                const checkNotification = await NotificationMessage.findOne({
                    emailReceiver: emailReceiver,
                    emailSender: email,
                }).exec();
                if(checkNotification){
                    checkNotification.isChecked = false;
                    await checkNotification.save();
                    res.status(200).json({
                        status: true,
                        message: 'OKE',
                        data: checkNotification,
                    });
                }else{
                    const createNotification = new NotificationMessage({
                        emailReceiver: emailReceiver,
                        emailSender: email,
                        isChecked: false,
                        status: true,
                    });
                    const create = await createNotification.save();
                    res.status(200).json({
                        status: true,
                        message: 'OKE',
                        data: create,
                    });
                }
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

module.exports = new NotificationMessageController();