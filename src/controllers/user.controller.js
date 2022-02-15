const { User } = require("../models");

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
        } catch (e) {
            res.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }
}

module.exports = new UserController();
