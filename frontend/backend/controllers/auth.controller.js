const bcrypt = require("bcrypt");
const Account = require("./../models/admin.model");
const ApiError = require("./../helpers/api-error");

// [POST]
module.exports.loginPost = async (req, res, next) => {
    try {
        console.log(req.body);
        const enteredEmail = req.body.email;
        const enteredPassword = req.body.password;

        const user = await Account.findOne({ email: enteredEmail });
        console.log(user);
        if (!user) {
            res.json("wrong info1");
            return;
        }

        if (!enteredPassword) {
            res.json("wrong info2");
            return;
        }

        const isPasswordMatch = await bcrypt.compare(
            enteredPassword,
            user.password
        );

        if (!isPasswordMatch) {
            res.json("wrong info3");
            return;
        }

        res.cookie("token", user.token);
        res.json("success");
    } catch (error) {
        console.log("error:", error);
        return next(new ApiError(500, error));
    }
};

// [GET]
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    // res.send({
    //     success: true,
    // });
    // return res.redirect("http://localhost:3001/login");
};
