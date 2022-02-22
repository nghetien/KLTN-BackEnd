const moment = require("moment");
const {
    POST,
    NOTIFICATION_COMMENT_POST,
    NOTIFICATION_COMMENT_PROBLEM,
    NOTIFICATION_YOUR_POST,
    NOTIFICATION_YOUR_PROBLEM,
} = require("../constants/var_constants");
const {
    Post,
    Problem,
    Comment,
    PostComment,
    User,
    ProblemComment,
    Notification,
} = require("../models");

class CommentController {
    async createComment(req, res) {
        try {
            const { idObject, type, idParent, content, email } = req.body;
            const newComment = new Comment({
                type,
                idParent,
                content,
                status: true,
            })
            const createComment = await newComment.save();
            if (createComment) {
                if (type === POST) {
                    const findOwnerOfPost = await Post.findById(idObject).exec();
                    const emailOwnerOfPost = findOwnerOfPost.email;
                    const newNotificationForOwner = new Notification(
                        {
                            emailReceiver: emailOwnerOfPost,
                            emailSender: email,
                            type: NOTIFICATION_YOUR_POST,
                            redirectUrl: idObject,
                            isChecked: false,
                        }
                    );
                    newNotificationForOwner.save();
                    const findAllPostCommentOfPost = await PostComment.find({
                        idPost: idObject,
                    }).exec();
                    for (const user of findAllPostCommentOfPost) {
                        if (user.email !== email && emailOwnerOfPost !== user.email) {
                            const newNotification = new Notification(
                                {
                                    emailReceiver: user.email,
                                    emailSender: email,
                                    type: NOTIFICATION_COMMENT_POST,
                                    redirectUrl: idObject,
                                    isChecked: false,
                                }
                            );
                            newNotification.save();
                        }
                    }
                    const newPostComment = new PostComment({
                        idPost: idObject,
                        email,
                        idComment: createComment._id.toString(),
                        status: true,
                    })
                    const createPostComment = await newPostComment.save();
                    if (createPostComment) {
                        res.status(200).json({
                            status: true,
                            message: "OKE",
                            data: null,
                        });
                    } else {
                        res.status(422).json({
                            status: false,
                            message: "Create post comment failure",
                            data: null,
                        });
                    }
                } else {
                    const findOwnerOfProblem = await Problem.findById(idObject).exec();
                    const emailOwnerOfProblem = findOwnerOfProblem.email;
                    const newNotificationForOwner = new Notification(
                        {
                            emailReceiver: emailOwnerOfProblem,
                            emailSender: email,
                            type: NOTIFICATION_YOUR_PROBLEM,
                            redirectUrl: idObject,
                            isChecked: false,
                        }
                    );
                    newNotificationForOwner.save();
                    const findAllPostProblemOfProblem = await ProblemComment.find({
                        idProblem: idObject,
                    }).exec();
                    for (const user of findAllPostProblemOfProblem) {
                        if (user.email !== email && user.email !== emailOwnerOfProblem) {
                            const newNotification = new Notification(
                                {
                                    emailReceiver: user.email,
                                    emailSender: email,
                                    type: NOTIFICATION_COMMENT_PROBLEM,
                                    redirectUrl: idObject,
                                    isChecked: false,
                                }
                            );
                            await newNotification.save();
                        }
                    }
                    const newProblemComment = new ProblemComment({
                        idProblem: idObject,
                        email,
                        idComment: createComment._id.toString(),
                        status: true,
                    })
                    const createProblemComment = await newProblemComment.save();
                    if (createProblemComment) {
                        res.status(200).json({
                            status: true,
                            message: "OKE",
                            data: null,
                        });
                    } else {
                        res.status(422).json({
                            status: false,
                            message: "Create problem comment failure",
                            data: null,
                        });
                    }
                }
            } else {
                res.status(422).json({
                    status: false,
                    message: "Create comment failure",
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

    async editComment(req, res) {
        try {
            const { idObjectComment, type, content, email } = req.body;
            if (type === POST) {
                const findPostComment = await PostComment.findById(idObjectComment).exec();
                if (findPostComment && findPostComment.email === email) {
                    const findComment = await Comment.findByIdAndUpdate(
                        findPostComment.idComment,
                        {
                            content: content
                        }
                    ).exec();
                    if (findComment) {
                        res.status(200).json({
                            status: true,
                            message: "OKE",
                            data: null,
                        });
                    } else {
                        res.status(422).json({
                            status: false,
                            message: "Edit comment failure",
                            data: null,
                        });
                    }
                } else {
                    res.status(401).json({
                        status: false,
                        message: "You don't have permission to edit",
                        data: null,
                    });
                }
            } else {
                const findProblemComment = await ProblemComment.findById(idObjectComment).exec();
                if (findProblemComment && findProblemComment.email === email) {
                    const findComment = await Comment.findByIdAndUpdate(
                        findProblemComment.idComment,
                        {
                            content: content
                        }
                    ).exec();
                    if (findComment) {
                        res.status(200).json({
                            status: true,
                            message: "OKE",
                            data: null,
                        });
                    } else {
                        res.status(422).json({
                            status: false,
                            message: "Edit comment failure",
                            data: null,
                        });
                    }
                } else {
                    res.status(401).json({
                        status: false,
                        message: "You don't have permission to edit",
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

    async deleteComment(req, res) {
        try {
            const { email } = req.body;
            const { idObjectComment, type } = req.params;
            if (type === POST) {
                const findPostComment = await PostComment.findById(idObjectComment).exec();
                if (findPostComment && findPostComment.email === email) {
                    findPostComment.status = false;
                    await findPostComment.save();
                    const findComment = await Comment.findByIdAndUpdate(
                        findPostComment.idComment,
                        {
                            status: false
                        }
                    ).exec();
                    if (findComment) {
                        res.status(200).json({
                            status: true,
                            message: "OKE",
                            data: null,
                        });
                    } else {
                        res.status(422).json({
                            status: false,
                            message: "Delete comment failure",
                            data: null,
                        });
                    }
                } else {
                    res.status(401).json({
                        status: false,
                        message: "You don't have permission to edit",
                        data: null,
                    });
                }
            } else {
                const findProblemComment = await ProblemComment.findById(idObjectComment).exec();
                if (findProblemComment && findProblemComment.email === email) {
                    findProblemComment.status = false;
                    await findProblemComment.save();
                    const findComment = await Comment.findByIdAndUpdate(
                        findProblemComment.idComment,
                        {
                            status: false
                        }
                    ).exec();
                    if (findComment) {
                        res.status(200).json({
                            status: true,
                            message: "OKE",
                            data: null,
                        });
                    } else {
                        res.status(422).json({
                            status: false,
                            message: "Delete comment failure",
                            data: null,
                        });
                    }
                } else {
                    res.status(401).json({
                        status: false,
                        message: "You don't have permission to edit",
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

    async getComment(req, res) {
        try {
            const { idObject, type } = req.params;
            let dataResponse = []
            if (type === POST) {
                const allPostComment = await PostComment.find({ idPost: idObject, status: true }).exec();
                for (const postComment of allPostComment) {
                    const comment = await Comment.findById(postComment.idComment).exec();
                    const findUser = await User.find({ email: postComment.email }).exec();
                    comment._doc.idObjectComment = postComment._id.toString();
                    comment._doc.email = postComment.email;
                    comment._doc.avatar = findUser[0].avatar ?? '';
                    comment._doc.lastUpdate = moment(comment._doc.updatedAt).format("X");
                    dataResponse.push(comment);
                }
            } else {
                const allProblemComment = await ProblemComment.find({ idPost: idObject, status: true }).exec();
                for (const problemComment of allProblemComment) {
                    const comment = await Comment.findById(problemComment.idComment).exec();
                    const findUser = await User.find({ email: problemComment.email }).exec();
                    comment._doc.idObjectComment = problemComment._id.toString();
                    comment._doc.email = problemComment.email;
                    comment._doc.avatar = findUser[0].avatar ?? '';
                    comment._doc.lastUpdate = moment(comment._doc.updatedAt).format("X");
                    dataResponse.push(comment);
                }
            }
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

module.exports = new CommentController();