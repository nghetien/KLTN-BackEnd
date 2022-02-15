const checkEmailAndPassword = function (req, res, next) {
    const { email, password } = req.body;
    if (email && password) {
        next();
    } else {
        res.status(400).json({
            status: false,
            message: email.length === 0 ? "Email is empty" : "Password is empty",
            data: null,
        });
    }
};

module.exports = checkEmailAndPassword;