import axios from "axios";

const url = "http://localhost:5000/posts";

export const fetchPosts = () => axios.get(url);

export const createPost = (newPost) => axios.post(url, newPost);

export const updatePost = (id, updatedPost) =>
  axios.patch(`${url}/${id}`, updatedPost);

export const deletePost = (id) => axios.delete(`${url}/${id}`);

export const likePost = (id, parentId) =>
  axios.patch(`${url}/${id}/likePost`, parentId);
//
export const dislikePost = (id, parentId) =>
  axios.patch(`${url}/${id}/dislikePost`, parentId);

export const repliesPost = (id, reply) =>
  axios.patch(`${url}/${id}/repliesPost`, reply);

export const deletePostReply = (id, parentId) =>
  axios.patch(`${url}/${id}/deletePostReply`, parentId);
