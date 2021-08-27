import React, { useEffect, useState } from "react";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { useDispatch } from "react-redux";
import "./styles.scss";

import { getPosts } from "../../actions/posts";

function Home() {
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

  // clears form from editId & replyingId. Put here so form and posts can both use it
  const clear = () => {
    setPostEditingId(null);
    setReplying(null);
  };

  return (
    <div className="home-container routes-container">
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
          <li className="genre genre-funny" name="Funny" onClick={setToActive}>
            Funny
          </li>
          <li
            className="genre genre-general"
            name="General"
            onClick={setToActive}
          >
            General
          </li>
          <li
            className="genre genre-personal"
            name="Personal"
            onClick={setToActive}
          >
            Personal
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
            clear={clear}
          />
        </div>
        <div className="form-outer-container">
          <Form
            postEditingId={postEditingId}
            replying={replying}
            clear={clear}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
