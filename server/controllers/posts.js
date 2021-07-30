import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage(post);

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// when editing post returns id and all postData, when editing reply returns postData with childId and parentId values inside
export const updatePost = async (req, res) => {
  // Destructoring then renaming id
  const { id: _id } = req.params;
  // Accessing post from req.body (req.body is given from second argument from api call in front end)
  const post = req.body;

  // runs when updating a reply
  if (post.parentId) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No post with that id");

    // Get parentPost
    const parentPost = await PostMessage.findById(post.parentId);

    // Filter posts from replies to get post that's updating
    const updatingPost = parentPost.replies.filter((replyPost) => {
      return post.childId == replyPost._id;
    });

    updatingPost[0] = post;

    // have new updatedParent. If childId is same as updatingPost[0] then return new reply otherwise return old reply
    // currently not working becasue parentPost is not being updated

    const updatedReplies = parentPost.replies.map((reply) => {
      if (updatingPost[0].childId == reply._id) return updatingPost[0];
      else return reply;
    });

    console.log("updatedReplies");
    console.log(updatedReplies);

    parentPost.replies = updatedReplies;

    console.log("parentPost");
    console.log(parentPost);

    await parentPost.save();

    res.json(parentPost);
  }
  // runs when updating a main post
  else {
    // If statement, checking if id of post is valid
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No post with that id");

    // Uses mongoose model to find a post by id and update it with new post. New option set to true returns the new post
    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { ...post, _id },
      {
        new: true,
      }
    );

    res.json(updatedPost);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  // If statement, checking if id of post is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  // if req.body.parentId exists then get parentId, only works when liking replies
  if (req.body.parentId) {
    const parentId = req.body.parentId;

    // If statement, checking if id of post is valid
    if (!mongoose.Types.ObjectId.isValid(parentId))
      return res.status(404).send("No post with that id");

    // Get parentPost
    const parentPost = await PostMessage.findById(parentId);

    // Filter posts from replies to get post that's updating
    const post = parentPost.replies.filter((post) => {
      return id == post._id;
    });

    // filter returns array, should only have one value so acccess it and update likeCount by 1
    post[0].likeCount = post[0].likeCount + 1;

    // Save parentPost since we're updating the subdocument but we need to save the full document
    await parentPost.save();

    // returns the parentPost
    res.json(parentPost);
  }
  // Works when liking main posts
  else {
    // If statement, checking if id of post is valid
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("No post with that id");

    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(
      id,
      { likeCount: post.likeCount + 1 },
      { new: true }
    );

    res.json(updatedPost);
  }
};

export const dislikePost = async (req, res) => {
  const { id } = req.params;

  // if req.body.parentId exists then get parentId, only works when liking replies
  if (req.body.parentId) {
    const parentId = req.body.parentId;

    // If statement, checking if id of post is valid
    if (!mongoose.Types.ObjectId.isValid(parentId))
      return res.status(404).send("No post with that id");

    // Get parentPost
    const parentPost = await PostMessage.findById(parentId);

    // Filter posts from replies to get post that's updating
    const post = parentPost.replies.filter((post) => {
      return id == post._id;
    });

    // filter returns array, should only have one value so acccess it and update dislikeCount by 1
    post[0].dislikeCount = post[0].dislikeCount + 1;

    // Save parentPost since we're updating the subdocument but we need to save the full document
    await parentPost.save();

    // returns the parentPost
    res.json(parentPost);
  }
  // Works when disliking main posts
  else {
    // If statement, checking if id of post is valid
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("No post with that id");

    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(
      id,
      { dislikeCount: post.dislikeCount + 1 },
      { new: true }
    );

    res.json(updatedPost);
  }
};

// Works when both replying to main post and replying to a reply
export const repliesPost = async (req, res) => {
  const { id } = req.params;

  const reply = req.body;

  // If statement, checking if id of post is valid
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  const post = await PostMessage.findById(id);

  post.replies.push({ ...reply, parentId: id });

  await post.save();

  res.json(post);
};

// Works when deleting reply. Made it a new function instead of adding to deleteReply since deleting a subdocument in mongodb is a patch request not delete
export const deletePostReply = async (req, res) => {
  const { id } = req.params;

  const parentId = req.body.parentId;

  // If statement, checking if id of post is valid
  if (!mongoose.Types.ObjectId.isValid(parentId))
    return res.status(404).send("No post with that id");

  // Get parentPost
  const parentPost = await PostMessage.findById(parentId);

  // Filter posts from replies to get post that's updating
  const post = parentPost.replies.filter((post) => {
    return id != post._id;
  });

  parentPost.replies = post;

  // Save parentPost since we're updating the subdocument but we need to save the full document
  await parentPost.save();

  // return the parentPost
  res.json(parentPost);
};
