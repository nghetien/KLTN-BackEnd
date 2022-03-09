const { Bookmark, Post, Problem } = require("../models");
const PostController = require("./post.controller");
const ProblemController = require("./problem.controller");
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
            if(idObject){
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
            }else {
                res.status(400).json({
                    status: false,
                    message: "Not found idObject",
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

    async getBookmarkPost(req, res) {
        try {
            const { email } = req.body;
            const findBookmark = await Bookmark.find({
                type: "POST",
                email,
                status: true,
            }).exec();
            const allPost = [];
            for(const bm of findBookmark){
                const post = await Post.findById(bm.idObject).exec();
                allPost.push(post);
            }
            const dataResponse = await PostController.dataResponseFromList(allPost);
            res.status(200).json({
                status: true,
                message: "OKE",
                data: dataResponse,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async getBookmarkProblem(req, res) {
        try {
            const { email } = req.body;
            const findBookmark = await Bookmark.find({
                type: "PROBLEM",
                email,
                status: true,
            }).exec();
            const allProblem = [];
            for(const bm of findBookmark){
                const problem = await Problem.findById(bm.idObject).exec();
                allProblem.push(problem);
            }
            const dataResponse = await ProblemController.getAllProblemFromListData(allProblem);
            res.status(200).json({
                status: true,
                message: "OKE",
                data: dataResponse,
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

module.exports = new BookmarkController();
