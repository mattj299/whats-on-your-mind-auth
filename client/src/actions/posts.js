import { FETCH_ALL, CREATE, UPDATE, DELETE } from "../constants/actionTypes";
import * as api from "../api";

// Action Creators. Functions that return actions and call api which calls dispatch with type and payload. Syntax is weird but it's react-redux thunk for async
export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();

    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    if (id.parentId) {
      id = id.parentId;
    }

    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};

// parentId for likes on replies becomes undefined if no argument is given, second argument so it works on replying posts as well
export const likePost =
  (id, parentId = undefined) =>
  async (dispatch) => {
    try {
      const { data } = await api.likePost(id, parentId);

      dispatch({ type: UPDATE, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

// parentId for likes on replies becomes undefined if no argument is given, second argument so it works on replying posts as well
export const dislikePost =
  (id, parentId = undefined) =>
  async (dispatch) => {
    try {
      const { data } = await api.dislikePost(id, parentId);

      dispatch({ type: UPDATE, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

export const repliesPost = (id, reply) => async (dispatch) => {
  try {
    const { data } = await api.repliesPost(id, reply);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// Had to create entire new function only for deleting replies, most other ones have if statements so can use replies and normal posts in one function
export const deletePostReply = (id, parentId) => async (dispatch) => {
  try {
    const { data } = await api.deletePostReply(id, parentId);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};
