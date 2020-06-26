import React from "react";
import {
  Paper,
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { signInWithGoogle, auth, createUserProfileDoc } from "../firebase";

export default class LoginSignupForm extends React.Component {
  constructor() {
    super();
    this.state = { displayName: "", email: "", password: "", form: "login" };
    this.handleChange = this.handleChange.bind(this);
    this.handleUserPasswordLogin = this.handleUserPasswordLogin.bind(this);
    this.handleSubmitNewUserForm = this.handleSubmitNewUserForm.bind(this);
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmitNewUserForm = async (e) => {
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
    const { displayName, email, password, form } = this.state;
    return form === "login" ? (
      <Container component="main" maxWidth="sm">
        <Paper>
          <Typography component="h1" varient="h5">
            Sign In
          </Typography>
          <form onSubmit={this.handleUserPasswordLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={this.handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={this.handleChange}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Sign In
            </Button>
          </form>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={signInWithGoogle}
          >
            Sign In With Google
          </Button>
          <Link
            href="#"
            variant="body2"
            onClick={() => this.setState({ form: "signup" })}
          >
            {"Don't have an account? Sign Up"}
          </Link>
        </Paper>
      </Container>
    ) : (
      <Container component="main" maxWidth="sm">
        <Paper>
          <Typography component="h1" varient="h5">
            Sign Up
          </Typography>
          <form onSubmit={this.handleSubmitNewUserForm}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="displayName"
              label="Your Display Name"
              name="displayName"
              autoFocus
              value={displayName}
              onChange={this.handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={this.handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={this.handleChange}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Sign Up
            </Button>
          </form>
          <Link
            href="#"
            variant="body2"
            onClick={() => this.setState({ form: "login" })}
          >
            {"Already have an account? Sign In"}
          </Link>
        </Paper>
      </Container>
    );
  }
}
