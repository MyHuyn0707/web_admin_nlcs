const PostModel = require("../models/Post.model");
const path = require("path");
const fs = require("fs");

exports.getPosts = async (req, res, next) => {
    try {
        const data = await PostModel.find();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

exports.createPost = async (req, res, next) => {
    try {
        const { className, name, scientificName, description, medicalInfo } =
            req.body;
        const image = req.file ? req.file.filename : null;

        const newPost = await PostModel.create({
            className,
            name,
            scientificName,
            description,
            medicalInfo,
            image,
        });

        res.json(newPost);
    } catch (error) {
        next(error);
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const updateData = {
            name: req.body.name,
            scientificName: req.body.scientificName,
            description: req.body.description,
            medicalInfo: req.body.medicalInfo,
        };

        if (req.file) {
            // Xóa ảnh cũ nếu có
            if (post.image) {
                const oldImagePath = path.join(
                    __dirname,
                    "..",
                    "uploads",
                    post.image
                );
                if (fs.existsSync(oldImagePath)) {
                    console.log(oldImagePath);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error("[Update] Lỗi xóa ảnh cũ:", err);
                        else console.log("[Update] Đã xóa ảnh cũ:", post.image);
                    });
                }
            }
            updateData.image = req.file.filename;
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("[Update] Lỗi cập nhật:", error);
        res.status(500).json({ error: "Update failed" });
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Xóa ảnh nếu có
        if (deletedPost.image) {
            const imagePath = path.join(
                __dirname,
                "..",
                "uploads",
                deletedPost.image
            );
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error("[Delete] Lỗi xóa ảnh:", err);
                    else console.log("[Delete] Đã xóa ảnh:", deletedPost.image);
                });
            }
        }

        res.status(200).json({ message: "Deleted successfully", deletedPost });
    } catch (error) {
        console.error("[Delete] Lỗi xóa bài viết:", error);
        next(error);
    }
};
