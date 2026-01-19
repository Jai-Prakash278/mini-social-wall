const fs = require("fs");
const path = require("path");
const multer = require('multer')
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })

exports.upload = upload

exports.addPost = async (req, res) => {
    try {
        const { text } = req.body;

        const newPost = new Post({
            user: req.user.id,
            username: req.user.username,
            text,
            image_url: req.file ? `/uploads/${req.file.filename}` : ""
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ created_at: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.addComment = async (req, res) => {
    try {
        const { comment } = req.body;

        const newComment = new Comment({
            post_id: req.params.id,
            user: req.user.id,
            username: req.user.username,
            comment
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post_id: req.params.id })
            .sort({ created_at: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updatePost = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }
        
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if user is the owner of the post
        if (post.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: "Not authorized to update this post" });
        }

        post.text = text;
        if (req.file) {
            // Delete old image if exists
            if (post.image_url) {
                const oldImagePath = path.join(__dirname, '../public', post.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            post.image_url = `/uploads/${req.file.filename}`;
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if user is the owner of the post
        if (post.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: "Not authorized to delete this post" });
        }

        // Delete image if exists
        if (post.image_url) {
            const imagePath = path.join(__dirname, '../public', post.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete all comments associated with the post
        await Comment.deleteMany({ post_id: req.params.id });

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
