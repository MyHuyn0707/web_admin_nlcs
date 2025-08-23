const postRouter = require("./post.route");
const authRouter = require("./auth.route");
const authMiddleware = require("../middlewares/auth.middleware");
const path = require("path");

module.exports = (app) => {
    app.use("/post", /* authMiddleware.authRequire */ postRouter);
    app.use("/auth", authRouter);

    // Phục vụ file tĩnh trong uploads
    app.use(
        "/uploads",
        require("express").static(path.join(__dirname, "..", "uploads"))
    );
};
