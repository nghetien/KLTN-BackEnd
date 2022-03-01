const moment = require("moment");
const { PUBLIC, NOTIFICATION_NEW_POST } = require("../constants/var_constants");

const {
    Post,
    Tag,
    PostTag,
    User,
    PostComment,
    Bookmark,
    Like,
    Follow,
    AccountToken,
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

class PostController {

    async dataResponseFromList(allPost) {
        let dataResponse = []
        for (const post of allPost) {
            const listPostTag = await PostTag.find({ idPost: post._id.toString() }).exec();
            const tags = []
            for (const postTag of listPostTag) {
                const tag = await Tag.findById(postTag.idTag).exec();
                tags.push({
                    _id: tag._id.toString(),
                    content: tag.content,
                    status: tag.status,
                })
            }
            const findUser = await User.find({ email: post.email }).exec();
            const findPostComment = await PostComment.find({ idPost: post._id.toString(), status: true }).exec();
            const findBookmark = await Bookmark.find({ idObject: post._id.toString(), status: true }).exec();
            const countLike = await Like.find({ idObject: post._id.toString(), isLike: true }).exec();
            const countDislike = await Like.find({ idObject: post._id.toString(), isLike: false }).exec();
            dataResponse.push({
                _id: post._id.toString(),
                email: post.email,
                namePost: post.namePost,
                shortContent: post.shortContent,
                content: post.content,
                typeContent: post.typeContent,
                timeCreate: post.timeCreate,
                lastUpdate: post.lastUpdate,
                view: post.view,
                like: countLike.length,
                comment: findPostComment.length,
                dislike: countDislike.length,
                bookmark: findBookmark.length,
                status: post.status,
                statusPost: post.statusPost,
                tags,
                avatar: findUser[0].avatar ?? '',
            })
        };
        return dataResponse;
    }

    async countMaxPagePost(req, res) {
        try {
            const { queryUserFollow } = req.query;
            let dataQuery = {
                statusPost: PUBLIC,
                status: true
            };
            if (queryUserFollow) {
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
            const allPost = await Post.find(dataQuery).exec();
            res.status(200).json({
                status: true,
                message: "OKE",
                data: allPost.length,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    managerPost = async (req, res) => {
        try {
            const { email } = req.body;
            const findUser = await User.findOne({ email }).exec();
            let allPost = [];
            if (findUser && findUser.role === 'ADMIN') {
                allPost = await Post.find().exec();
            } else {
                allPost = await Post.find({ email }).exec();
            }
            let dataResponse = await this.dataResponseFromList(allPost);
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

    getAllPost = async (req, res) => {
        try {
            const { queryUserFollow, pagePost } = req.query;
            let dataResponse = [];
            let dataQuery = {
                statusPost: PUBLIC,
                status: true
            };
            if (queryUserFollow) {
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
            const allPost = await Post.find(dataQuery)
                .sort({ 'timeCreate': -1 })
                .limit(10)
                .skip(pagePost ? pagePost * 10 : 0)
                .exec();
            dataResponse = await this.dataResponseFromList(allPost);
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

    async createPost(req, res) {
        try {
            const { email, title, listTag, shortContent, statusPost, typeContent, content } = req.body;
            const listTagId = await createListTag(listTag)
            const newPost = new Post({
                email,
                namePost: title,
                shortContent,
                content,
                typeContent,
                timeCreate: moment().unix(),
                lastUpdate: moment().unix(),
                view: 0,
                status: true,
                statusPost,
            });
            const createPost = await newPost.save();
            if (createPost) {
                await createListPostTag(listTagId, createPost._id.toString())
                const findAllUserFollowedMe = await Follow.find({
                    emailUserFollow: email
                }).exec();
                for (const user of findAllUserFollowedMe) {
                    const newNotification = new Notification(
                        {
                            emailReceiver: user.email,
                            emailSender: email,
                            type: NOTIFICATION_NEW_POST,
                            redirectUrl: createPost._id.toString(),
                            isChecked: false,
                        }
                    );
                    await newNotification.save();
                }
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: createPost,
                });
            } else {
                res.status(422).json({
                    status: false,
                    message: "Create post failure",
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

    async getInfoPost(req, res) {
        try {
            const findPost = await Post.findById(req.params.idPost).exec();
            if (findPost) {
                findPost.view += 1
                await findPost.save()
                const listPostTag = await PostTag.find({ idPost: findPost._id.toString() }).exec();
                const tags = []
                for (const postTag of listPostTag) {
                    const tag = await Tag.findById(postTag.idTag).exec();
                    tags.push({
                        _id: tag._id.toString(),
                        content: tag.content,
                        status: tag.status,
                    })
                }
                const findUser = await User.find({ email: findPost.email }).exec();
                const findPostComment = await PostComment.find({ idPost: findPost._id.toString(), status: true }).exec();
                const findBookmark = await Bookmark.find({ idObject: findPost._id.toString(), status: true }).exec();
                const countLike = await Like.find({ idObject: findPost._id.toString(), isLike: true }).exec();
                const countDislike = await Like.find({ idObject: findPost._id.toString(), isLike: false }).exec();
                const dataResponse = {
                    _id: findPost._id.toString(),
                    email: findPost.email,
                    namePost: findPost.namePost,
                    shortContent: findPost.shortContent,
                    content: findPost.content,
                    typeContent: findPost.typeContent,
                    timeCreate: findPost.timeCreate,
                    lastUpdate: findPost.lastUpdate,
                    view: findPost.view,
                    like: countLike.length,
                    comment: findPostComment.length,
                    dislike: countDislike.length,
                    bookmark: findBookmark.length,
                    status: findPost.status,
                    statusPost: findPost.statusPost,
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
                    message: "Id post not found",
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

module.exports = new PostController();