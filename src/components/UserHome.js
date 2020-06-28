import React from "react";
import {
  Header,
  Menu,
  Segment,
  Sidebar,
  Button,
  Tab,
  Grid,
  Input,
} from "semantic-ui-react";
import Timer from "./Timer";
import { firestore } from "../firebase";
import AllTasks from "./AllTasks";
import ActiveTasks from "./ActiveTasks";

export default class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      open: false,
      activeMenuItem: "",
      newTask: "",
      tasks: [],
      activeTasks: [],
    };
    this.toggleDrawerState = this.toggleDrawerState.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    this.addTask = this.addTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setTaskAsActive = this.setTaskAsActive.bind(this);
    this.setTaskAsInactive = this.setTaskAsInactive.bind(this);
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
      const activeTasks = tasks.filter((task) => task.active);
      this.setState({ tasks });
      this.setState({ activeTasks });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromTasks();
  };

  addTask() {
    console.log(this.userRef);
    try {
      this.taskRef.add({ taskName: this.state.newTask, active: true });
    } catch (error) {
      console.error(error);
    }
    this.setState({ newTask: "" });
  }

  setTaskAsActive(id) {
    try {
      this.taskRef.doc(`/${id}`).update({ active: true });
    } catch (error) {
      console.error(error);
    }
  }

  setTaskAsInactive(id) {
    try {
      this.taskRef.doc(`/${id}`).update({ active: false });
    } catch (error) {
      console.error(error);
    }
  }

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

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { open, activeMenuItem, tasks, activeTasks } = this.state;
    console.log("tasks", this.state.tasks);
    console.log("activeTasks", this.state.activeTasks);
    const panes = [
      {
        menuItem: "Tasks",
        render: () => (
          <Tab.Pane>
            <AllTasks
              tasks={tasks}
              setTaskAsInactive={this.setTaskAsInactive}
              setTaskAsActive={this.setTaskAsActive}
            />
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
                <ActiveTasks
                  activeTasks={activeTasks}
                  activeMenuItem={activeMenuItem}
                  handleMenuItemClick={this.handleMenuItemClick}
                />
                {/* <Menu vertical color="green" fluid>
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
                </Menu> */}
                <Input
                  fluid
                  action={<Button onClick={this.addTask}>Add</Button>}
                  placeholder="New Task"
                  name="newTask"
                  onChange={this.handleChange}
                  value={this.state.newTask}
                />
              </Segment>
              <Timer />
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
