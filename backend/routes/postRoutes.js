const express = require("express");
const postRouter = express.Router();
const postController = require("../controller/postController");
const verifyToken = require("../middleware/auth");

postRouter.post(
    '/',
    verifyToken,
    postController.upload.single('image'),
    postController.addPost
);
postRouter.get(
    '/',
    postController.getPost
);
postRouter.post('/:id/like', verifyToken, postController.toggleLike);
postRouter.post('/:id/comment', verifyToken, postController.addComment);
postRouter.get('/:id/comments', postController.getComments);
postRouter.put(
    '/:id',
    verifyToken,
    postController.upload.single('image'),
    postController.updatePost
);
postRouter.delete('/:id', verifyToken, postController.deletePost);


module.exports = postRouter;
