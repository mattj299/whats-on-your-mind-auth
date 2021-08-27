import React from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Input({ name, label, onChange, autoFocus, type, handleShowPassword }) {
  return (
    <div className={"auth-input-container"}>
      <input
        className="auth-input"
        required
        name={name}
        placeholder={label}
        onChange={onChange}
        autoFocus={autoFocus}
        type={type}
      />
      {name === "password" && (
        <button
          className="auth-input-visibility-toggle"
          onClick={handleShowPassword}
        >
          {type === "password" ? <AiFillEye /> : <AiFillEyeInvisible />}
        </button>
      )}
    </div>
  );
}

export default Input;
