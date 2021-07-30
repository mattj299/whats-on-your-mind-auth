import React from "react";
import "./styles.scss";

import { useSelector } from "react-redux";

import Post from "./Post/Post";

function Posts({ setPostEditingId, genre, sortByLikes, setReplying }) {
  const posts = useSelector((state) => state.posts);

  // Filters posts to only show posts of chosen genre
  const postsGenre = posts.filter((post) => {
    if (genre === "All") return post;

    return post.genre === genre;
  });

  // Sorts posts based off whether user chooses descending, ascending, or unordered
  if (sortByLikes === "Ascending") {
    postsGenre.sort(function (a, b) {
      return parseFloat(b.likeCount) - parseFloat(a.likeCount);
    });
  } else if (sortByLikes === "Descending") {
    postsGenre.sort(function (a, b) {
      return parseFloat(a.likeCount) - parseFloat(b.likeCount);
    });
  }

  // If there are no posts inside posts then return loading. If postGenre length is 0 then say no posts otherwise show posts
  return !posts.length ? (
    <>
      <h1>No posts here yet</h1>
      <h3>Either loading or there are no posts posted.</h3>
    </>
  ) : !postsGenre.length ? (
    <div className="posts-inner-container">
      <h1>No posts here yet</h1>
    </div>
  ) : (
    <div className="posts-inner-container">
      {postsGenre.map((post) => (
        <Post
          key={post._id}
          post={post}
          setPostEditingId={setPostEditingId}
          setReplying={setReplying}
        />
      ))}
    </div>
  );
}

export default Posts;
