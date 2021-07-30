import mongoose from "mongoose";

const repliesSchema = mongoose.Schema({
  comment: String,
  creator: String,
  parentId: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  dislikeCount: {
    type: Number,
    default: 0,
  },
});

const postSchema = mongoose.Schema({
  comment: String,
  creator: String,
  genre: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  dislikeCount: {
    type: Number,
    default: 0,
  },
  replies: [repliesSchema],
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
