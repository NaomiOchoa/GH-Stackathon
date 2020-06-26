import React from "react";
import { signInWithGoogle, auth, createUserProfileDoc } from "../firebase";

export default class LoginSignupForm extends React.Component {
  constructor() {
    super();
    this.state = { displayName: "", email: "", password: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, displayName } = this.state;
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      createUserProfileDoc(user, { displayName });
    } catch (error) {
      console.error(error);
    }
    this.setState({ displayName: "", email: "", password: "" });
  };

  handleUserPasswordLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    try {
      auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
    this.setState({ displayName: "", email: "", password: "" });
  };

  render() {
    const { displayName, email, password } = this.state;
    return (
      <div>
        <h1>Sign Up</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="displayName">Display Name:</label>
          <input
            name="displayName"
            value={displayName}
            onChange={this.handleChange}
          ></input>
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            value={email}
            onChange={this.handleChange}
          ></input>
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            value={password}
            onChange={this.handleChange}
          ></input>
          <button type="submit">Sign Up</button>
        </form>
        <h1>Or Log In:</h1>
        <form onSubmit={this.handleUserPasswordLogin}>
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            value={email}
            onChange={this.handleChange}
          ></input>
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            value={password}
            onChange={this.handleChange}
          ></input>
          <button type="submit">Log In</button>
        </form>
        <button type="button" onClick={signInWithGoogle}>
          Sign In With Google
        </button>
      </div>
    );
  }
}
