import React, { useContext } from "react";
import { auth } from "../firebase";
import {
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Button,
  Tab,
  Grid,
  List,
  Input,
  Statistic,
} from "semantic-ui-react";
import Timer from "./Timer";
import { firestore } from "../firebase";

export default class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      open: false,
      activeMenuItem: "0",
      newTask: "",
      tasks: this.props.tasks,
    };
    this.toggleDrawerState = this.toggleDrawerState.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    this.addTask = this.addTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  get userRef() {
    return firestore.doc(`users/${this.state.user.uid}`);
  }

  get taskRef() {
    return this.userRef.collection("tasks");
  }

  componentDidMount = async () => {
    this.unsubscribeFromTasks = this.taskRef.onSnapshot((snapshot) => {
      const tasks = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      this.setState({ tasks });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromTasks();
  };

  toggleDrawerState() {
    if (this.state.open) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
  }

  handleMenuItemClick(e, { name }) {
    console.log(name);
    this.setState({ activeMenuItem: name });
  }

  addTask() {
    console.log(this.userRef);
    try {
      this.taskRef.add({ taskName: this.state.newTask });
    } catch (error) {
      console.error(error);
    }
    this.setState({ newTask: "" });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { open, user, activeMenuItem } = this.state;
    console.log(this.state);
    const panes = [
      {
        menuItem: "Tasks",
        render: () => (
          <Tab.Pane>
            <Grid divided="vertically">
              <Grid.Row verticalAlign="center" columns={3}>
                <Grid.Column textAlign="left" floated="left">
                  Task Name
                </Grid.Column>
                <Grid.Column textAlign="right" floated="right">
                  <Button size="mini">Add to Today</Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row verticalAlign="center" columns={3}>
                <Grid.Column textAlign="left" floated="left">
                  Task Name
                </Grid.Column>
                <Grid.Column textAlign="right" floated="right">
                  <Button size="mini">Add to Today</Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row verticalAlign="center" columns={3}>
                <Grid.Column textAlign="left" floated="left">
                  Task Name
                </Grid.Column>
                <Grid.Column textAlign="right" floated="right">
                  <Button size="mini">Add to Today</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Stats",
        render: () => (
          <Tab.Pane>
            <Grid divided="vertically">
              <Grid.Row>Today</Grid.Row>
              <Grid.Row>This Week</Grid.Row>
              <Grid.Row>This Month</Grid.Row>
              <Grid.Row>This Year</Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
    ];

    return (
      <div id="full-content">
        <Sidebar.Pushable>
          <Sidebar
            animation="push"
            onHide={() => this.toggleDrawerState}
            visible={open}
            width="wide"
            as={Tab}
            panes={panes}
          />
          <Sidebar.Pusher>
            <div className="main-wrapper">
              <nav
                fixed="top"
                className="navbar"
                onClick={this.toggleDrawerState}
              >
                Main Menu
              </nav>
              <Header as="h1" className="section-title">
                Today
              </Header>
              <Segment className="task-segment">
                <Menu vertical color="green" fluid>
                  <Menu.Item
                    name="a"
                    active={activeMenuItem === "a"}
                    onClick={this.handleMenuItemClick}
                  />
                </Menu>
                <Menu vertical color="green" fluid>
                  <Menu.Item
                    name="b"
                    active={activeMenuItem === "b"}
                    onClick={this.handleMenuItemClick}
                  />
                </Menu>
                <Menu vertical color="green" fluid>
                  <Menu.Item
                    name="c"
                    active={activeMenuItem === "c"}
                    onClick={this.handleMenuItemClick}
                  />
                </Menu>
                <Input
                  fluid
                  action={<Button onClick={this.addTask}>Add</Button>}
                  placeholder="New Task"
                  name="newTask"
                  onChange={this.handleChange}
                  value={this.state.newTask}
                ></Input>
              </Segment>
              <Timer />
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
