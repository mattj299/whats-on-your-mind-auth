import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// this function happens before all of the requests below. sets header authorization
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const fetchPosts = () => API.get("/posts");

export const createPost = (newPost) => API.post("/posts", newPost);

export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const likePost = (id, parentId) =>
  API.patch(`/posts/${id}/likePost`, parentId);

export const dislikePost = (id, parentId) =>
  API.patch(`/posts/${id}/dislikePost`, parentId);

export const repliesPost = (id, reply) =>
  API.patch(`/posts/${id}/repliesPost`, reply);

export const deletePostReply = (id, parentId) =>
  API.patch(`/posts/${id}/deletePostReply`, parentId);

export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
