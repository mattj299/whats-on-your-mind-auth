import React, { useState } from "react";
import "./styles.scss";

import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import {
  AiOutlineDelete,
  AiFillCaretDown,
  AiFillCaretUp,
} from "react-icons/ai";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { ImReply } from "react-icons/im";

import moment from "moment";

import { useDispatch } from "react-redux";
import {
  deletePost,
  deletePostReply,
  dislikePost,
  likePost,
} from "../../../actions/posts";

function Post({ post, setPostEditingId, setReplying }) {
  // Toggles on and off to show replies of post
  const [showReplies, setShowReplies] = useState(false);
  const dispatch = useDispatch();

  const postReplies = post.replies;

  const toggleReplies = (e) => setShowReplies(!showReplies);

  return (
    <div className="post">
      <div className="post-main">
        <div className="post-top">
          <h4 className="post-comment">{post.comment}</h4>
          <p className="post-name">- {post.creator}</p>

          <button
            className="post-edit post-clickable"
            onClick={() => setPostEditingId(post._id)}
          >
            <HiOutlineDotsHorizontal className="post-icon" />
          </button>

          <div className="post-genre">
            <p>{post.genre}</p>
          </div>
        </div>

        <div className="post-extras-container">
          <div className="post-extras">
            <button
              className="post-likes post-div-with-icon post-clickable"
              onClick={() => dispatch(likePost(post._id))}
            >
              <FaRegThumbsUp className="post-icon" /> {post.likeCount}
            </button>
            <button
              className="post-dislikes post-div-with-icon post-clickable"
              onClick={() => dispatch(dislikePost(post._id))}
            >
              <FaRegThumbsDown className="post-icon" />
            </button>
          </div>

          <p className="post-date">{moment(post.createdAt).fromNow()}</p>
          <button
            className="post-delete post-div-with-icon post-clickable"
            onClick={() => {
              dispatch(deletePost(post._id));
              setPostEditingId(null);
            }}
          >
            <AiOutlineDelete className="post-icon" /> Delete
          </button>

          <button
            className="post-reply post-div-with-icon post-clickable"
            onClick={() => setReplying(post._id)}
          >
            <ImReply className="post-icon" />
          </button>
        </div>

        <div className="post-bottom">
          {postReplies.length > 0 && (
            <p className="post-bottom-p post-clickable" onClick={toggleReplies}>
              {showReplies ? "Hide" : "Show"} replies
              {showReplies ? (
                <AiFillCaretUp className="post-icon" />
              ) : (
                <AiFillCaretDown className="post-icon" />
              )}
            </p>
          )}
        </div>
      </div>

      {/* All replies to post, only shows replies if they exist */}
      <div className="post-replies">
        {showReplies &&
          postReplies.map((postReply) => (
            <div key={postReply._id} className="post-reply-post">
              <div className="post-top">
                <h4 className="post-comment">{postReply.comment}</h4>
                <p className="post-name">- {postReply.creator}</p>

                <button
                  className="post-edit post-edit-reply-post post-clickable"
                  onClick={() =>
                    // Pass this as a single object because it's a state change unlike the others. So no double argument just a single object
                    setPostEditingId({
                      childId: postReply._id,
                      parentId: post._id,
                    })
                  }
                >
                  <HiOutlineDotsHorizontal className="post-icon" />
                </button>
              </div>

              <div className="post-extras-container">
                <div className="post-extras">
                  <button
                    className="post-likes post-div-with-icon post-clickable"
                    onClick={() =>
                      dispatch(likePost(postReply._id, { parentId: post._id }))
                    }
                  >
                    <FaRegThumbsUp className="post-icon" />{" "}
                    {postReply.likeCount}
                  </button>
                  <button
                    className="post-dislikes post-div-with-icon post-clickable"
                    onClick={() =>
                      dispatch(
                        dislikePost(postReply._id, { parentId: post._id })
                      )
                    }
                  >
                    <FaRegThumbsDown className="post-icon" />
                  </button>
                </div>

                <p className="post-date">
                  {moment(postReply.createdAt).fromNow()}
                </p>
                <button
                  className="post-delete post-div-with-icon post-clickable"
                  onClick={() => {
                    dispatch(
                      deletePostReply(postReply._id, { parentId: post._id })
                    );
                    setPostEditingId(null);
                  }}
                >
                  <AiOutlineDelete className="post-icon" /> Delete
                </button>

                <button
                  className="post-reply post-div-with-icon post-clickable"
                  onClick={() =>
                    // Pass this as a single object because it's a state change unlike the others. So no double argument just a single object
                    setReplying({
                      childId: postReply._id,
                      parentId: post._id,
                    })
                  }
                >
                  <ImReply className="post-icon" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Post;
