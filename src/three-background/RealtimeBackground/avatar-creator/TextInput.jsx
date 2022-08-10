import React, {useState} from "react";
let style = {
  border: "1px solid black",
  padding: "10px",
  margin:"auto",
  display: "block",
}
const TextInput = props => {
  return (
    <input
      style={style}
    className="input-edit-note"
    name="avatar"
    onChange={props.onChange}
    value={props.avatarName}             // title will always be state title
    placeholder="choose your name" // props.title will always remain the same
  />
  );
};

export default TextInput;