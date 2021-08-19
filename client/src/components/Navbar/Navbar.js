import React, { useEffect, useState } from "react";
import "./styles.scss";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

function Navbar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const logout = () => {
    dispatch({ type: "LOGOUT" });

    history.push("/");

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    // JWT...

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-title-container">
        <Link to="/">
          <h1 className="navbar-title">What's on your mind?</h1>
        </Link>
      </div>

      <div className="navbar-toolbar">
        {user ? (
          <div className="navbar-profile">
            {user?.result.imageUrl ? (
              <div
                className="navbar-avatar"
                style={{ backgroundImage: `url(${user?.result.imageUrl})` }}
              ></div>
            ) : (
              <div className="navbar-avatar">{user.result.name.charAt(0)}</div>
            )}

            <p className="navbar-username">{user.result.name}</p>

            <button
              className="navbar-log-in-out navbar-log-out"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/auth">
            <button className="navbar-log-in-out navbar-log-in">Log In</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
