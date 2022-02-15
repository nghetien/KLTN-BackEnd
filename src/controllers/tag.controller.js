const { Tag } = require("../models");

class TagController {
    async getAllTag(req, res) {
        try {
            res.status(200).json({
                status: true,
                message: "OKE",
                data: '',
            });
        } catch (e) {
            res.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }

    async createTag(req, res) {
        try {
            const { content } = req.body;
            const findTag = await Tag.findOne({ content }).exec();
            if(findTag) {
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: findTag,
                });
            }else {
                const newTag = new Tag({
                    content,
                    status: true,
                });
                const createTag = await newTag.save();
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: createTag,
                });
            }
            
        } catch (e) {
            res.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }

    async deleteTag(req, res) {
        try {
            res.status(200).json({
                status: true,
                message: "OKE",
                data: '',
            });
        } catch (e) {
            res.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }
}

module.exports = new TagController();