import React, { useEffect, useState } from "react";
import "./App.scss";

import { useDispatch } from "react-redux";

import { getPosts } from "./actions/posts";
import Form from "./components/Form/Form";
import Posts from "./components/Posts/Posts";

function App() {
  // postEditingId state so that post can be updated inside form component
  const [postEditingId, setPostEditingId] = useState(null);
  // genre state so posts can render specified genre in genre section
  const [genre, setGenre] = useState("All");
  // sortByLikes state so posts can render in ascending, descending or unordered based on likeCount
  const [sortByLikes, setSortByLikes] = useState("Unordered");
  // replyingToPost state so there can be replies to post from form component
  const [replying, setReplying] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [postEditingId, dispatch]);

  // Changes the genre--active class to be active depending on li that is clicked
  const setToActive = (e) => {
    const elementGenre = e.target.getAttribute("name");
    setGenre(elementGenre);

    const activeClass = document.getElementsByClassName("genre--active")[0];
    activeClass.classList.remove("genre--active");

    const targetItem = e.target;
    targetItem.classList.add("genre--active");
  };

  const onSortByLikesChange = (e) => {
    setSortByLikes(e.target.value);
  };

  return (
    <>
      <div className="container no-footer-content">
        <nav className="navbar">
          <h1>What's on your mind?</h1>
        </nav>

        <div className="genres-container">
          <ul className="genres">
            <li
              className="genre genre-all genre--active"
              name="All"
              onClick={setToActive}
            >
              All
            </li>
            <li
              className="genre genre-serious"
              name="Serious"
              onClick={setToActive}
            >
              Serious
            </li>
            <li
              className="genre genre-funny"
              name="Funny"
              onClick={setToActive}
            >
              Funny
            </li>
            <li
              className="genre genre-general"
              name="General"
              onClick={setToActive}
            >
              General
            </li>
          </ul>
        </div>

        <div className="form--posts-outer-container">
          <div className="posts-outer-container">
            <div className="posts-sort-by">
              <label className="posts-sort-by-label">
                <h2>Sort by likes</h2>
              </label>
              <select
                name="sortByLikes"
                value={sortByLikes}
                onChange={onSortByLikesChange}
              >
                <option value="Unordered">Unordered</option>
                <option value="Ascending">Most Liked</option>
                <option value="Descending">Least Liked</option>
              </select>
            </div>
            <Posts
              setPostEditingId={setPostEditingId}
              genre={genre}
              sortByLikes={sortByLikes}
              setReplying={setReplying}
            />
          </div>
          <div className="form-outer-container">
            <Form
              postEditingId={postEditingId}
              setPostEditingId={setPostEditingId}
              replying={replying}
              setReplying={setReplying}
            />
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-section">
          <p>What's on your mind?</p>
        </div>
        <div className="footer-section">
          <p>© 2021</p>
        </div>
        <div className="footer-section">
          <p>Matthew Jimenez</p>
        </div>
      </footer>
    </>
  );
}

export default App;
