import React, { useState } from "react";
import "./styles.scss";

// GET RID OF DELETE AND UPDATE IF USER DIDN'T CREATE IT. done with main now do with replies. just appeneded creator to replies now.
// try understanding where authoriztion comes from in auth.js. write a comment about these things so you don't have to constantly figure these things out seriously.
//  already done with main posts now do it with replies. might be more complicated, simplify it. it's never as complicated as you think, honestly

import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
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

// placement of where clear is placed is important. first clears everything then adds new data, not vice versa
function Post({ post, setPostEditingId, setReplying, clear }) {
  // Toggles on and off to show replies of post
  const [showReplies, setShowReplies] = useState(false);
  const dispatch = useDispatch();
  // gets user from localStorage to check if creator liked posts or replies or not
  const user = JSON.parse(localStorage.getItem("profile"));

  // checks if user logged in liked main posts
  const creatorLikedPost = post.likes.find(
    (like) => like === (user?.result?.googleId || user?.result?._id)
  );

  // checks if user logged in disliked main posts
  const creatorDislikedPost = post.dislikes.find(
    (dislike) => dislike === (user?.result?.googleId || user?.result?._id)
  );

  const creatorCreatedPost =
    (user?.result?.googleId || user?.result?._id) === post?.creator;

  // if creatorCreatedPost true then add width 25% to data, likes-dislike, delete, and reply, otherwise delete gets removed and rest get width 33%

  const postReplies = post.replies;

  const toggleReplies = (e) => setShowReplies(!showReplies);

  return (
    <div className="post">
      <div className="post-main">
        <div className="post-top">
          <h4 className="post-comment">{post.comment}</h4>
          <p className="post-name">- {post.name}</p>

          {creatorCreatedPost && (
            <button
              className="post-edit post-clickable"
              onClick={() => {
                clear();
                setPostEditingId(post._id);
              }}
            >
              <HiOutlineDotsHorizontal className="post-icon" />
            </button>
          )}

          <div className="post-genre">
            <p>{post.genre}</p>
          </div>
        </div>

        <div className="post-extras-container">
          <div
            className="post-likes-dislikes"
            style={creatorCreatedPost ? { width: "25%" } : {}}
          >
            <button
              className="post-likes post-div-with-icon post-clickable"
              onClick={() => dispatch(likePost(post._id))}
              disabled={!user?.result}
            >
              {creatorLikedPost ? (
                <FaThumbsUp className="post-icon" />
              ) : (
                <FaRegThumbsUp className="post-icon" />
              )}
              {post.likes.length}
            </button>
            <button
              className="post-dislikes post-div-with-icon post-clickable"
              onClick={() => dispatch(dislikePost(post._id))}
              disabled={!user?.result}
            >
              {creatorDislikedPost ? (
                <FaThumbsDown className="post-icon" />
              ) : (
                <FaRegThumbsDown className="post-icon" />
              )}
            </button>
          </div>

          <p
            className="post-date"
            style={creatorCreatedPost ? { width: "25%" } : {}}
          >
            {moment(post.createdAt).fromNow()}
          </p>

          {creatorCreatedPost && (
            <button
              style={creatorCreatedPost ? { width: "25%" } : {}}
              className="post-delete post-div-with-icon post-clickable"
              onClick={() => {
                dispatch(deletePost(post._id));
                clear();
              }}
            >
              <AiOutlineDelete className="post-icon" /> Delete
            </button>
          )}

          <button
            style={creatorCreatedPost ? { width: "25%" } : {}}
            className="post-reply post-div-with-icon post-clickable"
            onClick={() => {
              clear();
              setReplying(post._id);
            }}
            disabled={!user?.result}
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
          // checks if user liked reply or not. changes thumbs up icon depending on true or false
          postReplies.map((postReply) => {
            const creatorLikedReply = postReply?.likes?.find(
              (like) => like === (user?.result?.googleId || user?.result?._id)
            );

            const creatorDislikedReply = postReply?.dislikes?.find(
              (dislike) =>
                dislike === (user?.result?.googleId || user?.result?._id)
            );

            // checks if user created reply. if so then display edit and delete button for reply otherwise don't display them
            const creatorCreatedReply =
              (user?.result?.googleId || user?.result?._id) ==
              postReply.creator;

            return (
              <div key={postReply._id} className="post-reply-post">
                <div className="post-top">
                  <h4 className="post-comment">{postReply.comment}</h4>
                  <p className="post-name">- {postReply.name}</p>

                  {creatorCreatedReply && (
                    <button
                      className="post-edit post-edit-reply-post post-clickable"
                      onClick={() => {
                        clear();
                        // Pass this as a single object because it's a state change unlike the others. So no double argument just a single object
                        setPostEditingId({
                          childId: postReply._id,
                          parentId: post._id,
                        });
                      }}
                    >
                      <HiOutlineDotsHorizontal className="post-icon" />
                    </button>
                  )}
                </div>

                <div className="post-extras-container">
                  <div
                    className="post-likes-dislikes"
                    style={creatorCreatedReply ? { width: "25%" } : {}}
                  >
                    <button
                      className="post-likes post-div-with-icon post-clickable"
                      onClick={(e) => {
                        dispatch(
                          likePost(postReply._id, { parentId: post._id })
                        );
                      }}
                      disabled={!user?.result}
                    >
                      {creatorLikedReply ? (
                        <FaThumbsUp className="post-icon" />
                      ) : (
                        <FaRegThumbsUp className="post-icon" />
                      )}
                      {postReply.likes.length}
                    </button>
                    <button
                      className="post-dislikes post-div-with-icon post-clickable"
                      onClick={() =>
                        dispatch(
                          dislikePost(postReply._id, { parentId: post._id })
                        )
                      }
                      disabled={!user?.result}
                    >
                      {creatorDislikedReply ? (
                        <FaThumbsDown className="post-icon" />
                      ) : (
                        <FaRegThumbsDown className="post-icon" />
                      )}
                    </button>
                  </div>

                  <p
                    className="post-date"
                    style={creatorCreatedReply ? { width: "25%" } : {}}
                  >
                    {moment(postReply.createdAt).fromNow()}
                  </p>

                  {creatorCreatedReply && (
                    <button
                      style={creatorCreatedReply ? { width: "25%" } : {}}
                      className="post-delete post-div-with-icon post-clickable"
                      onClick={() => {
                        dispatch(
                          deletePostReply(postReply._id, { parentId: post._id })
                        );
                        clear();
                      }}
                    >
                      <AiOutlineDelete className="post-icon" /> Delete
                    </button>
                  )}

                  <button
                    style={creatorCreatedReply ? { width: "25%" } : {}}
                    className="post-reply post-div-with-icon post-clickable"
                    onClick={() => {
                      clear();
                      // Pass this as a single object because it's a state change unlike the others. So no double argument just a single object
                      setReplying({
                        childId: postReply._id,
                        parentId: post._id,
                      });
                    }}
                    disabled={!user?.result}
                  >
                    <ImReply className="post-icon" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Post;
