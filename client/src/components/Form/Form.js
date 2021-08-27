import React, { useState, useEffect } from "react";
import "./styles.scss";

import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost, repliesPost } from "../../actions/posts";

// parentId only populates when updating a post
const INITIAL_STATE = {
  comment: "",
  genre: "Serious",
  anonymous: false,
  parentId: "",
};

function Form({ postEditingId, replying, clear }) {
  const dispatch = useDispatch();
  const [postData, setPostData] = useState(INITIAL_STATE);
  // getting user from localStorage
  const user = JSON.parse(localStorage.getItem("profile"));
  // added to check if user is authenticated or not and if user clicked anonymous or not. if user clicked anonymous then set name to anonymous otherwise users name
  INITIAL_STATE.name = user?.result?.name;

  // Checks if postEditingId is true. If true then become post that wants to be updated and change form to edit post otherwise return null
  const postEditingTo = useSelector((state) =>
    postEditingId ? state.posts.find((p) => p._id === postEditingId) : null
  );

  // Checks if postEditingId.parentId is true. If true then return post otherwise return null. Only true when editing a reply since postEditingId becomes an object
  const parentPostEditingTo = useSelector((state) =>
    postEditingId
      ? state.posts.find((p) => p._id === postEditingId.parentId)
      : null
  );

  // childPostEditingTo only has a value when parentPostEditingTo is true, only true when editing a reply. filter returns array
  let childPostEditingTo;

  if (parentPostEditingTo) {
    childPostEditingTo = parentPostEditingTo.replies.filter(
      (editing) => editing._id == postEditingId.childId
    );
  }

  // Checks if replying is true. Then checks to see if replying.parentId exists and matches with a post id, if none match return null. works when replying to a reply
  const parentPostReplyingTo = useSelector((state) =>
    replying ? state.posts.find((p) => p._id === replying.parentId) : null
  );

  // childPost only has a value when parentPostReplyTo is true, only true when replying to a reply. filter returns array
  const childPostReplyingTo = parentPostReplyingTo
    ? parentPostReplyingTo.replies.filter(
        (reply) => reply._id == replying.childId
      )
    : null;

  // whenever clear runs setPostData to INITIAL_STATE & name back to user's name. used to remove any form data if user clicks reply after edit on a post
  useEffect(() => {
    setPostData({ ...INITIAL_STATE, name: user?.result?.name });
  }, [clear]);

  useEffect(() => {
    // runs when editing reply. if true then have all content inside childPostEditingTo go into form. ALL content  goes into form including likeCount, _id, etc.
    if (parentPostEditingTo) setPostData(childPostEditingTo[0]);
    // runs when editing main post. if true then all content inside postEditingTo go into form. ALL content from post goes into form including likeCount, _id, etc.
    else if (postEditingTo) setPostData(postEditingTo);
    // runs when parentPostReplyingTo is true. Only runs when replying to a reply and not to main post
    else if (parentPostReplyingTo)
      setPostData({
        ...INITIAL_STATE,
        comment: `@${childPostReplyingTo[0].name}`,
      });
    // runs when replying is true. Only runs when replying to main post and not to replies, does nothing just returns so clearForm function doesn't get called
    else if (replying) return;
    // if none true run clearForm statement
    else clearForm();
  }, [postEditingTo, parentPostReplyingTo, parentPostEditingTo]);

  // handles submit of form. All case scenarios for submitting. Order only matters for else and repyling part. Then run clearForm function
  const handleSubmit = (e) => {
    e.preventDefault();
    // Runs when editing reply
    if (typeof postEditingId === "object" && postEditingId !== null) {
      dispatch(
        updatePost(postEditingId.parentId, {
          ...postData,
          childId: postEditingId.childId,
        })
      );
    }
    // runs when editing main post
    else if (postEditingId) {
      dispatch(updatePost(postEditingId, postData));
    }
    // only true if replying to a reply because then it populates replying with an object
    else if (typeof replying === "object" && replying !== null) {
      dispatch(repliesPost(replying.parentId, postData));
    }
    // runs when replying to normal post since populates reply with just a string which is an id of the post
    else if (replying) {
      dispatch(repliesPost(replying, postData));
    }

    // runs when wanting to create a new post
    else {
      dispatch(createPost(postData));
    }

    clearForm();
  };

  const onChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  // onCheckChange. Toggles anonymous on and off. Toggled to true then name becomes anonymous, if becomes false then name gets named Anonymous
  const onCheckChange = () => {
    const anonymousState = postData.anonymous;

    if (anonymousState) {
      setPostData({
        ...postData,
        anonymous: !postData.anonymous,
        name: user?.result?.name,
      });
    } else {
      setPostData({
        ...postData,
        anonymous: !postData.anonymous,
        name: "Anonymous",
      });
    }
  };

  // clearForm function setPostEditingId & setReplying gets called with null then setPostData gets set with the initial state of the form
  const clearForm = () => {
    clear();

    setPostData({ ...INITIAL_STATE });
  };

  // If comment is empty then not allowed to submit form
  const isInvalid = postData.comment === "";

  // if user is not authenticated
  if (!user?.result?.name) {
    return (
      <div className="form--unauthenticated">
        <h2>Please Sign In to your account or create an account.</h2>
      </div>
    );
  }

  return (
    <>
      <form
        className="form"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <h3>
          {postEditingId ? "Editing" : replying ? "Replying to" : "Creating"} a
          post
        </h3>
        <label className="form--textarea-label form--label">
          This is a safe place to say what's on your mind
        </label>
        <textarea
          className="form--textarea"
          name="comment"
          value={postData.comment}
          onChange={onChange}
          placeholder="What's on your mind?"
        />

        <div className="form--anonymous-container">
          <label className="form--anonymous-label form--label">
            Stay anonymous?
          </label>
          <input
            className="form--checkbox"
            name="anonymous"
            type="checkbox"
            checked={postData.anonymous}
            onChange={onCheckChange}
          />
        </div>

        <div className="form--genre-container">
          <label className="form--genre-label">Select a genre</label>
          <select name="genre" value={postData.genre} onChange={onChange}>
            <option value="Serious">Serious</option>
            <option value="Funny">Funny</option>
            <option value="General">General</option>
          </select>
        </div>

        <button
          disabled={isInvalid}
          className={isInvalid ? "form--button form--invalid" : "form--button"}
          type="submit"
        >
          Submit
        </button>
        <button
          onClick={() => clearForm()}
          className="form--button"
          type="reset"
        >
          Clear
        </button>
      </form>
    </>
  );
}

export default Form;
