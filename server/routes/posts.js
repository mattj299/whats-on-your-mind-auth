import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  repliesPost,
  deletePostReply,
} from "../controllers/posts.js";

const router = express.Router();

// Requests. first argument goes after what is specified in index.js of server. EX /posts/:whateverThisIs. Second arg is controller(function that's called)
router.get("/", getPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/likePost", likePost);
router.patch("/:id/dislikePost", dislikePost);
router.patch("/:id/repliesPost", repliesPost);
// Creates new route only because it uses patch since the reply is a subdocument so it's actually just updating the main document
router.patch("/:id/deletePostReply", deletePostReply);

export default router;
