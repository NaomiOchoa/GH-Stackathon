import React from "react";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";
import Blinky from "./Blinky";

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
      <React.Fragment>
        <Grid
          textAlign="center"
          style={{ height: "70vh" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 700 }}>
            <Header as="h1" className="site-title">
              Whatcha Doin?
            </Header>
            <Segment>
              <Grid textAlign="center">
                <Grid.Row>
                  <Header as="h2">Sign In</Header>
                </Grid.Row>
                <Grid.Row>
                  <Form onSubmit={this.handleUserPasswordLogin}>
                    <Form.Field
                      required
                      id="email"
                      label="Email Address"
                      name="email"
                      control="input"
                      autoFocus
                      value={email}
                      onChange={this.handleChange}
                    />
                    <Form.Field
                      required
                      id="password"
                      label="Password"
                      name="password"
                      control="input"
                      type="password"
                      value={password}
                      onChange={this.handleChange}
                    />
                    <Button type="submit" fullWidth>
                      Sign In
                    </Button>
                  </Form>
                </Grid.Row>
                <Grid.Row>
                  <Button
                    type="button"
                    color="primary"
                    onClick={signInWithGoogle}
                  >
                    Sign In With Google
                  </Button>
                </Grid.Row>
                <Grid.Row>
                  <a href="#" onClick={() => this.setState({ form: "signup" })}>
                    {"Don't have an account? Sign Up"}
                  </a>
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid>
        <Blinky />
      </React.Fragment>
    ) : (
      <Grid
        textAlign="center"
        style={{ height: "70vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 700 }}>
          <Header as="h1" className="site-title">
            Whatcha Doin?
          </Header>

          <Segment>
            <Grid textAlign="center">
              <Grid.Row>
                <Header as="h2">Sign Up</Header>
              </Grid.Row>
              <Grid.Row>
                <Form onSubmit={this.handleSubmitNewUserForm}>
                  <Form.Field
                    required
                    id="displayName"
                    label="Your Display Name"
                    name="displayName"
                    control="input"
                    autoFocus
                    value={displayName}
                    onChange={this.handleChange}
                  />
                  <Form.Field
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    control="input"
                    value={email}
                    onChange={this.handleChange}
                  />
                  <Form.Field
                    required
                    id="password"
                    label="Password"
                    name="password"
                    control="input"
                    type="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Sign Up
                  </Button>
                </Form>
              </Grid.Row>
              <Grid.Row>
                <a href="#" onClick={() => this.setState({ form: "login" })}>
                  {"Already have an account? Sign In"}
                </a>
              </Grid.Row>
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
