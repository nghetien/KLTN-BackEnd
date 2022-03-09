const { Follow, User } = require("../models");

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

    async getUserFollowed(req, res) {
        try {
            const { emailTarget } = req.params;
            const { isFollowed } = req.query;
            let findFollow;
            if (isFollowed === "true") {
                findFollow = await Follow.find({
                    emailUserFollow: emailTarget,
                    status: true,
                }).exec();
            } else {
                findFollow = await Follow.find({
                    email: emailTarget,
                    status: true,
                }).exec();
            }
            if (findFollow) {
                let dataResponse = [];
                for (const follow of findFollow) {
                    const findUser = await User.findOne({
                        email: isFollowed === "true" ? follow.email : follow.emailUserFollow
                    }).exec();
                    dataResponse.push(findUser);
                }
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: dataResponse,
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