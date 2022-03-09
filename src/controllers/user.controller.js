const { User, Post, Problem, Follow } = require("../models");
const PostController = require("./post.controller");
const ProblemController = require("./problem.controller");

class UserController {
    async getInfoUser(req, res) {
        try {
            const { email } = req.body;
            const findUser = await User.findOne({
                email,
            });
            if (findUser) {
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: findUser,
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: "Not found account",
                    data: "",
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

    async profileUser(req, res) {
        try {
            const { email } = req.params;
            const dataResponse = {};
            const [
                findUser,
                countPost,
                countProblem,
                getPost,
                getProblem,
                countFollow,
                countFollowed,
            ] = await Promise.all([
                User.findOne({ email }).exec(),
                Post.countDocuments({ email }).exec(),
                Problem.countDocuments({ email }).exec(),
                Post.find({ email }).limit(5).exec(),
                Problem.find({ email }).limit(5).exec(),
                Follow.countDocuments({ email, status: true }).exec(),
                Follow.countDocuments({ emailUserFollow: email, status: true }).exec(),
            ]);
            if (findUser) {
                dataResponse.info = findUser;
                dataResponse.countFollow = countFollow;
                dataResponse.countPost = countPost;
                dataResponse.countFollowed = countFollowed;
                dataResponse.countProblem = countProblem;
                [
                    dataResponse.post,
                    dataResponse.problem,
                ] = await Promise.all([
                    PostController.dataResponseFromList(getPost),
                    ProblemController.getAllProblemFromListData(getProblem),
                ]);
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: dataResponse,
                });
            } else {
                res.status(404).json({
                    status: false,
                    message: "Not found user",
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

    async editProfile(req, res) {
        try {
            const {
                email,
                fullName,
                phoneNumber,
                studentCode,
                department,
                major,
                address,
            } = req.body;
            const findUser = await User.findOne({
                email,
            });
            if (findUser) {
                findUser.full_name = fullName;
                findUser.phone_number = phoneNumber;
                findUser.department_code = department;
                findUser.major_code = major;
                findUser.student_code = studentCode;
                findUser.address = address;
                await findUser.save();
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: findUser,
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: "Not found account",
                    data: "",
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

    async editAvatarProfile(req, res) {
        try {
            const {
                email,
                avatar,
            } = req.body;
            const findUser = await User.findOne({
                email,
            });
            if (findUser) {
                findUser.avatar = avatar;
                await findUser.save();
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: findUser,
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: "Not found account",
                    data: "",
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

    async historyUser(req, res) {
        try {
            const { email } = req.params;
            const [
                findAllPost,
                findAllProblem,
            ] = await Promise.all([
                Post.find({ email }).exec(),
                Problem.find({ email }).exec(),
            ]);
            const [
                responsePost,
                responseProblem,
            ] = await Promise.all([
                PostController.dataResponseFromList(findAllPost),
                ProblemController.getAllProblemFromListData(findAllProblem),
            ]);
            const dataResponse = {
                post: responsePost,
                problem: responseProblem,
            };
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

module.exports = new UserController();
