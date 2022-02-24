const moment = require("moment");
const { NOTIFICATION_NEW_PROBLEM } = require("../constants/var_constants");
const {
    Problem,
    Tag,
    ProblemTag,
    User,
    Bookmark,
    Like,
    Follow,
    AccountToken,
    ProblemComment,
    Notification,
} = require("../models");

const createListTag = async (listTag) => {
    let listIdTag = []
    for (const content of listTag) {
        const findTag = await Tag.findOne({ content }).exec();
        if (findTag) {
            listIdTag.push(findTag._id.toString());
        } else {
            const newTag = new Tag({
                content,
                status: true,
            });
            const createTag = await newTag.save();
            listIdTag.push(createTag._id.toString());
        }
    }
    return listIdTag;
}

const createListProblemTag = async (listIdTag, idProblem) => {
    for (const idTag of listIdTag) {
        const newProblemTag = new ProblemTag({
            idProblem,
            idTag,
            status: true,
        });
        await newProblemTag.save();
    }
}

const getAllProblemFromListData = async (allProblem) => {
    let dataResponse = []
    for (const problem of allProblem) {
        const listProblemTag = await ProblemTag.find({ idProblem: problem._id.toString() }).exec();
        const tags = []
        for (const problemTag of listProblemTag) {
            const tag = await Tag.findById(problemTag.idTag).exec();
            tags.push({
                _id: tag._id.toString(),
                content: tag.content,
                status: tag.status,
            })
        }
        const findUser = await User.find({ email: problem.email }).exec();
        const findProblemComment = await ProblemComment.find({ idProblem: problem._id.toString(), status: true }).exec();
        const findBookmark = await Bookmark.find({ idObject: problem._id.toString(), status: true }).exec();
        const countLike = await Like.find({ idObject: problem._id.toString(), isLike: true }).exec();
        const countDislike = await Like.find({ idObject: problem._id.toString(), isLike: false }).exec();
        dataResponse.push({
            _id: problem._id.toString(),
            email: problem.email,
            nameProblem: problem.nameProblem,
            shortContent: problem.shortContent,
            content: problem.content,
            typeContent: problem.typeContent,
            timeCreate: problem.timeCreate,
            lastUpdate: problem.lastUpdate,
            view: problem.view,
            like: countLike.length,
            comment: findProblemComment.length,
            dislike: countDislike.length,
            bookmark: findBookmark.length,
            status: problem.status,
            isHaveCorrectAnswer: problem.isHaveCorrectAnswer,
            tags,
            avatar: findUser[0].avatar ?? '',
        })
    };
    return dataResponse;
}

class ProblemController {

    async countMaxPageProblem(req, res) {
        try {
            const { queryFollow, isHaveCorrectAnswer } = req.query;
            let dataQuery = {
                status: true
            };
            if (queryFollow) {
                const { token } = req.headers;
                const findUser = await AccountToken.findOneAndUpdate(
                    {
                        token,
                    },
                    {
                        time_create: moment().unix(),
                        expiration_date: moment().unix() + 30 * 24 * 60 * 60,
                    }
                ).exec();
                const email = findUser.email;
                const findAllMyUserFollowed = await Follow.find({ email, status: true }).exec();
                dataQuery = {
                    ...dataQuery,
                    ...{
                        email: {
                            $in: findAllMyUserFollowed.map(user => user.emailUserFollow),
                        },
                    }
                }
            }
            if (isHaveCorrectAnswer !== undefined) {
                dataQuery = {
                    ...dataQuery,
                    ...{
                        isHaveCorrectAnswer
                    }
                }
            }
            const allProblem = await Problem.find(dataQuery).exec();
            res.status(200).json({
                status: true,
                message: "OKE",
                data: allProblem.length,
            });
        } catch (e) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async getAllProblem(req, res) {
        try {
            const { queryFollow, isHaveCorrectAnswer, pageProblem } = req.query;
            let dataResponse = [];
            let dataQuery = {
                status: true
            };
            if (queryFollow) {
                const { token } = req.headers;
                const findUser = await AccountToken.findOneAndUpdate(
                    {
                        token,
                    },
                    {
                        time_create: moment().unix(),
                        expiration_date: moment().unix() + 30 * 24 * 60 * 60,
                    }
                ).exec();
                const email = findUser.email;
                const findAllMyUserFollowed = await Follow.find({ email, status: true }).exec();
                dataQuery = {
                    ...dataQuery,
                    ...{
                        email: {
                            $in: findAllMyUserFollowed.map(user => user.emailUserFollow),
                        },
                    }
                }
            }
            if (isHaveCorrectAnswer !== undefined) {
                dataQuery = {
                    ...dataQuery,
                    ...{
                        isHaveCorrectAnswer
                    }
                }
            }
            const allProblem = await Problem.find(dataQuery)
                .sort({ 'timeCreate': -1 })
                .limit(10)
                .skip(pageProblem ? pageProblem * 10 : 0)
                .exec();
            dataResponse = await getAllProblemFromListData(allProblem);
            dataResponse = dataResponse.sort((a, b) => b.timeCreate - a.timeCreate);
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

    async createProblem(req, res) {
        try {
            const { email, title, listTag, shortContent, typeContent, content } = req.body;
            const listTagId = await createListTag(listTag)
            const newProblem = new Problem({
                email,
                nameProblem: title,
                shortContent,
                content,
                typeContent,
                timeCreate: moment().unix(),
                lastUpdate: moment().unix(),
                view: 0,
                status: true,
                isHaveCorrectAnswer: false,
            });
            const createProblem = await newProblem.save();
            if (createProblem) {
                await createListProblemTag(listTagId, createProblem._id.toString())
                const findAllUserFollowedMe = await Follow.find({
                    emailUserFollow: email
                }).exec();
                for (const user of findAllUserFollowedMe) {
                    const newNotification = new Notification(
                        {
                            emailReceiver: user.email,
                            emailSender: email,
                            type: NOTIFICATION_NEW_PROBLEM,
                            redirectUrl: createProblem._id.toString(),
                            isChecked: false,
                        }
                    );
                    await newNotification.save();
                }
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: createProblem,
                });
            } else {
                res.status(422).json({
                    status: false,
                    message: "Create problem failure",
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

    async getInfoProblem(req, res) {
        try {
            const findProblem = await Problem.findById(req.params.idProblem).exec();
            if (findProblem) {
                findProblem.view += 1
                await findProblem.save()
                const listProblemTag = await ProblemTag.find({ idProblem: findProblem._id.toString() }).exec();
                const tags = []
                for (const problemTag of listProblemTag) {
                    const tag = await Tag.findById(problemTag.idTag).exec();
                    tags.push({
                        _id: tag._id.toString(),
                        content: tag.content,
                        status: tag.status,
                    })
                }
                const findUser = await User.find({ email: findProblem.email }).exec();
                const findProblemComment = await ProblemComment.find({ idProblem: findProblem._id.toString(), status: true }).exec();
                const findBookmark = await Bookmark.find({ idObject: findProblem._id.toString(), status: true }).exec();
                const countLike = await Like.find({ idObject: findProblem._id.toString(), isLike: true }).exec();
                const countDislike = await Like.find({ idObject: findProblem._id.toString(), isLike: false }).exec();
                const dataResponse = {
                    _id: findProblem._id.toString(),
                    email: findProblem.email,
                    nameProblem: findProblem.nameProblem,
                    shortContent: findProblem.shortContent,
                    content: findProblem.content,
                    typeContent: findProblem.typeContent,
                    timeCreate: findProblem.timeCreate,
                    lastUpdate: findProblem.lastUpdate,
                    view: findProblem.view,
                    like: countLike.length,
                    comment: findProblemComment.length,
                    dislike: countDislike.length,
                    bookmark: findBookmark.length,
                    status: findProblem.status,
                    isHaveCorrectAnswer: findProblem.isHaveCorrectAnswer,
                    tags,
                    avatar: findUser[0].avatar ?? '',
                }
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: dataResponse,
                });
            } else {
                res.status(404).json({
                    status: true,
                    message: "Id problem not found",
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

    async toggleCorrectAnswer(req, res) {
        try {
            const { email } = req.body;
            const { idProblem } = req.params;
            const findProblem = await Problem.findById(idProblem).exec()
            if (findProblem && findProblem.email === email) {
                findProblem.isHaveCorrectAnswer = !findProblem.isHaveCorrectAnswer;
                await findProblem.save();
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: null,
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Not found problem',
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

module.exports = new ProblemController();