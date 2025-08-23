const Account = require("./../models/admin.model");

module.exports.authRequire = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect("http://localhost:3001/login");
    }

    const user = await Account.findOne({
        token: req.cookies.token,
    });

    if (!user) {
        if (req.cookies.token) {
            res.clearCookie("token");
            return res.redirect("http://localhost:3001/login");
        }
        return res.redirect("http://localhost:3001/login");
    }

    // res.locals.user = user;
    next();
};
