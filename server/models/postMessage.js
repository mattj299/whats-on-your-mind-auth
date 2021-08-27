import mongoose from "mongoose";

// creator is the user id. rest is self explanatory
const repliesSchema = mongoose.Schema({
  comment: String,
  creator: String,
  name: String,
  parentId: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String],
    default: [],
  },
  dislikes: {
    type: [String],
    default: [],
  },
});

const postSchema = mongoose.Schema({
  comment: String,
  creator: String,
  name: String,
  genre: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String],
    default: [],
  },
  dislikes: {
    type: [String],
    default: [],
  },
  replies: [repliesSchema],
});

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
