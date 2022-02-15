const { Like } = require("../models");
const { POST, PROBLEM } = require("../constants/var_constants");

class LikeController {
    async getLike(req, res) {
        try {
            const { email } = req.body;
            const { idObject } = req.params;
            const findLike = await Like.findOne({
                idObject,
                email
            }).exec();
            if (findLike) {
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: findLike,
                });
            } else {
                res.status(200).json({
                    status: true,
                    message: "OKE",
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

    async setLikeOrDislike(req, res) {
        try {
            const { idObject } = req.params;
            const { type, email, isLike } = req.body;
            if (type !== POST && type !== PROBLEM) {
                res.status(401).json({
                    status: false,
                    message: "Type not found",
                    data: null,
                });
            } else {
                const findLike = await Like.findOne({
                    idObject,
                    email
                }).exec();
                if (findLike) {
                    if (isLike === findLike.isLike) {
                        await Like.findOneAndDelete({ idObject, email }).exec()
                    } else {
                        await Like.findOneAndUpdate({ idObject, email }, { isLike }).exec()
                    }
                    res.status(200).json({
                        status: true,
                        message: "OKE",
                        data: null,
                    });
                } else {
                    const newLike = new Like({
                        type,
                        email,
                        idObject,
                        isLike,
                    });
                    await newLike.save();
                    res.status(200).json({
                        status: true,
                        message: "OKE",
                        data: null,
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

module.exports = new LikeController();
