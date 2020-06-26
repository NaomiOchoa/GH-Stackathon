import React from "react";
import { auth } from "../firebase";

export default function UserHome(props) {
  return (
    <div>
      <h1>There is a user</h1>
      <h2>It's me, {props.user.displayName}</h2>
      <button type="button" onClick={() => auth.signOut()}>
        Log them out
      </button>
    </div>
  );
}
