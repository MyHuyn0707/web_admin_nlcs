const express = require('express');
const postRoute = express.Router();


let PostModel = require('../models/Post');



const multer = require('multer');
const path = require('path');
const fs = require('fs');



// index 
postRoute.route('/').get(async (req, res, next) => {
  try {
    const data = await PostModel.find(); // lấy danh sách bài viết
    var parsedData = res.json(data);
  } catch (error) {
    next(error);
  }
});


// Cấu hình lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // tên file: 16599999.jpg
  }
});

const upload = multer({ storage });

// create post
postRoute.post('/create-post', upload.single('image'), async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPost = await PostModel.create({
      name,
      description,
      image
    });

    res.json(newPost);
  } catch (error) {
    next(error);
  }
});




// update-post
postRoute.post('/update-post/:id', upload.single('image'), async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const updateData = {
      name: req.body.name,
      description: req.body.description,
    };

    if (req.file) {
      // Xóa ảnh cũ nếu có
      if (post.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, err => {
            if (err) console.error('[Update] Lỗi xóa ảnh cũ:', err);
            else console.log('[Update] Đã xóa ảnh cũ:', post.image);
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
    console.error('[Update] Lỗi cập nhật:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});



// delete post
postRoute.delete('/delete-post/:id', async (req, res, next) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Xóa ảnh nếu có
    if (deletedPost.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', deletedPost.image);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, err => {
          if (err) console.error('[Delete] Lỗi xóa ảnh:', err);
          else console.log('[Delete] Đã xóa ảnh:', deletedPost.image);
        });
      }
    }

    res.status(200).json({ message: 'Deleted successfully', deletedPost });
  } catch (error) {
    console.error('[Delete] Lỗi xóa bài viết:', error);
    next(error);
  }
});

module.exports = postRoute;