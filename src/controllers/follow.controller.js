const { Follow } = require("../models");

class FollowController {
    async getFollow(req, res) {
        try {
            const { emailUserFollow } = req.params;
            const { email } = req.body;
            const findFollow = await Follow.findOne({
                email,
                emailUserFollow
            }).exec();
            if (findFollow && findFollow.status) {
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: findFollow,
                });
            } else {
                res.status(200).json({
                    status: false,
                    message: "Not follow",
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

    async toggleFollowUser(req, res) {
        try {
            const { email, emailUserFollow } = req.body;
            const findFollow = await Follow.findOne({
                email,
                emailUserFollow
            }).exec();
            if (findFollow) {
                findFollow.status = !findFollow.status;
                findFollow.save();
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: findFollow,
                });
            } else {
                const newFollow = new Follow({
                    email,
                    emailUserFollow,
                    status: true,
                })
                const createNewFollow = await newFollow.save()
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: createNewFollow,
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

module.exports = new FollowController();