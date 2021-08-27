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

import auth from "../middleware/auth.js";
const router = express.Router();

// Requests. first argument goes after what is specified in index.js of server. EX /posts/:whateverThisIs. Second arg is controller(function that's called)
router.get("/", getPosts);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.patch("/:id/dislikePost", auth, dislikePost);
router.patch("/:id/repliesPost", auth, repliesPost);
// Creates new route only because it uses patch since the reply being deleted is a subdocument so it's actually just updating the main document
router.patch("/:id/deletePostReply", auth, deletePostReply);

export default router;
