const express = require("express");
const postRoute = express.Router();

const postController = require("../controllers/post.controller");
const upload = require("../helpers/uploadMulter");

postRoute.get("/get-post", postController.getPosts);

postRoute.post(
    "/create-post",
    upload.single("image"),
    postController.createPost
);

postRoute.put(
    "/update-post/:id",
    upload.single("image"),
    postController.updatePost
);

postRoute.delete("/delete-post/:id", postController.deletePost);

module.exports = postRoute;
