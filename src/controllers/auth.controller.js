const moment = require("moment");
const MD5 = require("crypto-js/sha256");
const { OAuth2Client } = require("google-auth-library");

const { Account, AccountToken, User } = require("../models");
const VAR_CONSTANTS = require("../constants/var_constants");

class AuthController {

    async getTokenUser(req, res) {
        const { email, avatar } = req.body
        const findTokenAndUpdate = await AccountToken.findOneAndUpdate(
            {
                email,
            },
            {
                time_create: moment().unix(),
                expiration_date: moment().unix() + 30 * 24 * 60 * 60,
            }
        );
        let token = "";
        if (!findTokenAndUpdate) {
            const newAccountToken = await AccountToken({
                email,
                token: MD5(email + moment().unix()),
                time_create: moment().unix(),
                expiration_date: moment().unix() + 30 * 24 * 60 * 60,
            });
            await newAccountToken.save();
            token = newAccountToken.token;
        } else {
            token = findTokenAndUpdate.token;
        }
        const findUser = await User.findOne({ email }).exec();
        if (!findUser) {
            const newUser = new User({
                email: email,
                full_name: "",
                avatar: avatar,
                phone_number: "",
                role: VAR_CONSTANTS.STUDENT,
                department_code: "",
                major_code: "",
                student_code: "",
                status: true,
            });
            const createUser = await newUser.save();
            if (createUser) {
                return res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: { token },
                });
            } else {
                return res.status(422).json({
                    status: false,
                    message: "Create new user failure",
                    data: null,
                });
            }
        } else {
            return res.status(200).json({
                status: true,
                message: "OKE",
                data: {
                    token: token,
                },
            });
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const findAccount = await Account.findOne({
                email,
                password,
                status: true,
            }).exec();
            if (findAccount) {
                req.body.email = email;
                next();
            } else {
                res.status(400).json({
                    status: false,
                    message: "Incorrect account or password",
                    data: null,
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }

    async loginGoogle(req, res, next) {
        try {
            const { token } = req.body;
            const client = new OAuth2Client(process.env.CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (payload) {
                const email = payload.email;
                const password = token;
                const findAccount = await Account.findOne({ email }).exec();
                if (!findAccount) {
                    const newAccount = new Account({
                        email,
                        password,
                        status: true,
                    });
                    await newAccount.save();
                }
                req.body.email = email;
                req.body.avatar = payload.picture;
                next();
            } else {
                res.status(500).json({
                    status: false,
                    message: "Login google API fail",
                    data: null,
                });
            }
        } catch (e) {
            res.status(500).json({
                status: false,
                message: e,
                data: null,
            });
        }
    }

    async register(req, res) {
        try {
            const { email, password } = req.body;
            const findAccount = await Account.findOne({ email }).exec();
            if (findAccount) {
                res.status(400).json({
                    status: false,
                    message: "Email already exists",
                    data: null,
                });
            } else {
                const newAccount = new Account({
                    email,
                    password,
                    status: true,
                });
                const createAccount = await newAccount.save();
                if (createAccount) {
                    const newUser = new User({
                        email: email,
                        full_name: "",
                        avatar: "",
                        phone_number: "",
                        role: VAR_CONSTANTS.STUDENT,
                        department_code: "",
                        major_code: "",
                        student_code: "",
                        status: true,
                    });
                    const createUser = await newUser.save();
                    if (createUser) {
                        res.status(200).json({
                            status: true,
                            message: "OKE",
                            data: { email },
                        });
                    } else {
                        res.status(422).json({
                            status: false,
                            message: "Create new user failure",
                            data: null,
                        });
                    }
                } else {
                    res.status(422).json({
                        status: false,
                        message: "Create account failure",
                        data: null,
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }

    async logout(req, res) {
        try {
            const { email } = req.body;
            const result = await AccountToken.findOneAndDelete({ email });
            if (result) {
                res.status(200).json({
                    status: true,
                    message: "OKE",
                    data: null,
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: "Logout failure",
                    data: null,
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }
}

module.exports = new AuthController();
