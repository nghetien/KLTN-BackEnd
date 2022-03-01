const { POST, PROBLEM } = require("../constants/var_constants");
const {
    Post,
    Problem,
    Tag,
    PostTag,
    ProblemTag,
    User
} = require("../models");

class SearchController {
    async search(req, res) {
        try {
            const { keyword } = req.query;
            const lowSearch = keyword.toLowerCase().trim();
            const [allPost, allProblem] = await Promise.all([
                Post.find().exec(),
                Problem.find().exec(),
            ]);
            // post
            let dataPost = [];
            for (const post of allPost) {
                const listPostTag = await PostTag.find({ idPost: post._id.toString() }).exec();
                const tags = [];
                for (const postTag of listPostTag) {
                    const tag = await Tag.findById(postTag.idTag).exec();
                    tags.push(tag.content);
                }
                dataPost.push({
                    type: POST,
                    value: post.namePost,
                    redirectUrl: `/post/${post._id.toString()}`,
                    timeCreate: post.timeCreate,
                    email: post.email,
                    namePost: post.namePost,
                    shortContent: post.shortContent,
                    typeContent: post.typeContent,
                    tags,
                })
            }
            dataPost = dataPost.filter(post => {
                return Object.values(post).some(val => {
                    if (typeof (val) === 'string') {
                        return String(val).toLowerCase().includes(lowSearch)
                    } else if (Array.isArray(val)) {
                        return val.some(valTag => String(valTag).toLowerCase().includes(lowSearch))
                    }
                })
            })
            // problem
            let dataProblem = [];
            for (const problem of allProblem) {
                const listProblemTag = await ProblemTag.find({ idProblem: problem._id.toString() }).exec();
                const tags = [];
                for (const problemTag of listProblemTag) {
                    const tag = await Tag.findById(problemTag.idTag).exec();
                    tags.push(tag.content);
                }
                dataProblem.push({
                    type: PROBLEM,
                    redirectUrl: `/problem/${problem._id.toString()}`,
                    value: problem.nameProblem,
                    timeCreate: problem.timeCreate,
                    email: problem.email,
                    nameProblem: problem.nameProblem,
                    shortContent: problem.shortContent,
                    typeContent: problem.typeContent,
                    tags,
                })
            }
            dataProblem = dataProblem.filter(problem => {
                return Object.values(problem).some(val => {
                    if (typeof (val) === 'string') {
                        return String(val).toLowerCase().includes(lowSearch)
                    } else if (Array.isArray(val)) {
                        return val.some(valTag => String(valTag).toLowerCase().includes(lowSearch))
                    }
                })
            })
            const dataResponse = [
                ...dataPost,
                ...dataProblem,
            ]
            res.status(200).json({
                status: true,
                message: 'OKE',
                data: dataResponse,
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async searchUser(req, res) {
        try {
            const { keyword } = req.query;
            const lowSearch = keyword.toLowerCase().trim();
            const allUser = await User.find().exec();
            let dataResponse = [];
            dataResponse = allUser.filter(user => {
                return String(user.email).toLowerCase().includes(lowSearch)
            })
            res.status(200).json({
                status: true,
                message: 'OKE',
                data: dataResponse,
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }
}

module.exports = new SearchController();
