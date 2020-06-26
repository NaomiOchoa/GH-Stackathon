import React, { useContext } from "react";
import LoginSignupForm from "./LoginSignupForm";
import UserHome from "./UserHome";
import { UserContext } from "../providers/UserProvider";

export default function Authentication() {
  const user = useContext(UserContext);
  return user ? <UserHome user={user} /> : <LoginSignupForm />;
}
