const AccountToken = require("./auth/account_token.model");
const Account = require("./auth/account.model");
const User = require("./auth/user.model");
const Comment = require("./comment/comment.model");
const PostComment = require("./post/post_comment.model");
const PostTag = require("./post/post_tag.model");
const Post = require("./post/post.model");
const SeriesPost = require("./post/series_post.model");
const Tag = require("./tag/tag.model");
const Bookmark = require("./bookmark/bookmark.model");
const Like = require("./like/like.model");

module.exports = {
    AccountToken,
    Account,
    User,
    Comment,
    PostComment,
    PostTag,
    Post,
    SeriesPost,
    Tag,
    Bookmark,
    Like,
};