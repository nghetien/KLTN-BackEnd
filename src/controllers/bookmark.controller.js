const { Bookmark } = require("../models");
const { POST, PROBLEM } = require("../constants/var_constants");

class BookmarkController {
    async getBookmark(req, res) {
        try {
            const { email } = req.body;
            const { idObject } = req.params;
            const findBookmark = await Bookmark.findOne({
                idObject,
                email,
            }).exec();
            res.status(200).json({
                status: true,
                message: "OKE",
                data: findBookmark,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async toggleBookmark(req, res) {
        try {
            const { idObject } = req.params;
            const { type, email } = req.body;
            if (type !== POST && type !== PROBLEM) {
                res.status(401).json({
                    status: false,
                    message: "Type not found",
                    data: null,
                });
            } else {
                const findBookmark = await Bookmark.findOne({
                    idObject,
                    email,
                }).exec();
                if (findBookmark) {
                    findBookmark.status = !findBookmark.status;
                    await findBookmark.save();
                    res.status(200).json({
                        status: true,
                        message: "OKE",
                        data: findBookmark,
                    });
                } else {
                    const newBookmark = new Bookmark({
                        idObject,
                        type,
                        email,
                        status: true,
                    });
                    await newBookmark.save();
                    res.status(200).json({
                        status: true,
                        message: "OKE",
                        data: newBookmark,
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

module.exports = new BookmarkController();
