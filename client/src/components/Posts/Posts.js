import React, { useEffect, useState } from "react";
import "./styles.scss";

import { useSelector } from "react-redux";

import Post from "./Post/Post";

function Posts({ setPostEditingId, genre, sortByLikes, setReplying, clear }) {
  const [loadingPosts, setLoadingPosts] = useState(true);

  const posts = useSelector((state) => {
    return state.posts;
  });
  console.log(posts);

  // if posts don't get received within 5 seconds then display that there are no posts.
  useEffect(() => {
    if (posts.length) setLoadingPosts(false);
    setTimeout(() => {
      setLoadingPosts(false);
    }, 5000);
  }, [posts]);

  const user = JSON.parse(localStorage.getItem("profile"));

  // Filters posts to only show posts of chosen genre
  const postsGenre = posts.filter((post) => {
    if (genre === "All") return post;

    return post.genre === genre;
  });

  // returns posts created by currently logged in user
  const userCreatedPosts = posts.filter((post) => {
    return (
      post.creator == user?.result?._id ||
      post.creator == user?.result?.googleId
    );
  });

  // Sorts posts based off whether user chooses descending, ascending, or unordered
  if (sortByLikes === "Ascending") {
    postsGenre.sort(function (a, b) {
      return parseFloat(b.likes.length) - parseFloat(a.likes.length);
    });
  } else if (sortByLikes === "Descending") {
    postsGenre.sort(function (a, b) {
      return parseFloat(a.likes.length) - parseFloat(b.likes.length);
    });
  }

  // if statement is true then return posts only created by the user
  if (genre === "Personal" && userCreatedPosts) {
    return (
      <div className="posts-inner-container">
        {userCreatedPosts.map((post) => (
          <Post
            key={post._id}
            post={post}
            clear={clear}
            setPostEditingId={setPostEditingId}
            setReplying={setReplying}
          />
        ))}
      </div>
    );
  }

  // If loadingPosts is true then display loading
  // if loaded but no posts then display no posts here
  // If postGenre length is 0 then say no posts
  // if any posts and no errors such as connection interruption then show posts
  return loadingPosts ? (
    <h1 className="posts-inner-container">Loading...</h1>
  ) : !posts.length ? (
    <>
      <h1 className="posts-inner-container">No posts here yet</h1>
    </>
  ) : !postsGenre.length ? (
    <div className="posts-inner-container" style={{ marginTop: "25px" }}>
      <h1>No posts here yet</h1>
    </div>
  ) : (
    <div className="posts-inner-container">
      {postsGenre.map((post) => (
        <Post
          key={post._id}
          post={post}
          clear={clear}
          setPostEditingId={setPostEditingId}
          setReplying={setReplying}
        />
      ))}
    </div>
  );
}

export default Posts;
