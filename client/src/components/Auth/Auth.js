import React, { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import Icon from "./icon";
import { FaLock } from "react-icons/fa";
import Input from "./Input";
import { signin, signup } from "../../actions/auth";

import { AiFillInfoCircle } from "react-icons/ai";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

import "./styles.scss";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);
  // used to display if user's input for email or password are wrong and display's error saying try again
  const [incorrectUserInput, setIncorrectUserInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }

    setLoading(true);
    setIncorrectUserInput(false);

    // if user doesn't get logged in within 5 seconds show error
    setTimeout(() => {
      setLoading(false);
      setIncorrectUserInput(true);
    }, 5000);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: "AUTH", data: { result, token } });
      setLoading(true);

      history.push("/");
    } catch (error) {
      console.log(error);
      setIncorrectUserInput(true);
    }
  };

  const googleFailure = () => {
    console.log("Google Sign In was unsuccessful. Try again later.");
  };

  return (
    <div className="routes-container auth-container">
      <div className="auth-form-container">
        <FaLock className="auth-lock-icon" />

        <h5 className="auth-form-title">{isSignup ? "Sign Up" : "Sign In"}</h5>

        {isSignup && (
          <Tippy
            content="Please type a password that will be remembered as the password CANNOT be recovered leading to a completely locked account."
            className="auth-info-tippy"
            arrow={false}
          >
            <div className="auth-info-sign-up">
              <AiFillInfoCircle />
            </div>
          </Tippy>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          {isSignup && (
            <>
              <Input
                name="firstName"
                label="First Name"
                onChange={onChange}
                autoFocus
              />
              <Input name="lastName" label="Last Name" onChange={onChange} />
            </>
          )}
          <Input
            name="email"
            label="Email Address"
            onChange={onChange}
            type="email"
          />
          <Input
            name="password"
            label="Password"
            onChange={onChange}
            type={showPassword ? "text" : "password"}
            handleShowPassword={handleShowPassword}
          />
          {isSignup && (
            <Input
              name="confirmPassword"
              label="Repeat Password"
              onChange={onChange}
              type="password"
            />
          )}

          {loading && <p>Loading...</p>}

          {incorrectUserInput && (
            <p className="auth-incorrect-user-input">
              Inputs may be incorrect or connection interruption.
              <br></br>
              <br></br>
              Please try again.
              <br></br>
              <br></br>
            </p>
          )}

          <button type="submit" className="auth-btn">
            {isSignup ? "Sign Up" : "Sign In"}
          </button>

          <GoogleLogin
            clientId="892379786412-gcnttv63j7553utrmi3ic6q84imtc1ch.apps.googleusercontent.com"
            render={(renderProps) => (
              <button
                className="google-button auth-btn"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <Icon /> Google Sign In
              </button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />

          <button className="auth-btn" onClick={switchMode}>
            {isSignup
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
