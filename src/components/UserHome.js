import React from "react";
import {
  Header,
  Segment,
  Sidebar,
  Button,
  Tab,
  Grid,
  Input,
  Icon,
} from "semantic-ui-react";
import Timer from "./Timer";
import { auth, firestore } from "../firebase";
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
    this.addTimeEvent = this.addTimeEvent.bind(this);
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
    try {
      this.taskRef.add({ taskName: this.state.newTask, active: true });
    } catch (error) {
      console.error(error);
    }
    this.setState({ newTask: "" });
  }

  addTimeEvent(min, sec) {
    try {
      const addedAt = new Date();
      const task = this.state.activeMenuItem;
      let secondsSpent = min * 60 + sec;
      firestore
        .doc(
          `users/${this.state.user.uid}/tasks/${this.state.activeMenuItem.id}`
        )
        .collection("timeEvents")
        .add({
          addedAt,
          secondsSpent,
        });
      this.userRef.collection("timeEvents").add({
        addedAt,
        secondsSpent,
        task,
      });
    } catch (error) {
      console.error(error);
    }
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

  handleMenuItemClick(e, { value }) {
    const activeTask = this.state.activeTasks.filter(
      (task) => task.id === value
    );
    this.setState({ activeMenuItem: activeTask[0] });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { open, activeMenuItem, tasks, activeTasks, user } = this.state;
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
              <nav fixed="top" className="navbar">
                <Icon
                  id="menu-control"
                  name="bars"
                  onClick={this.toggleDrawerState}
                />
                <Header id="page-title">Whatcha Doin'</Header>
                <div id="user-logout">
                  <span>{user.displayName}</span>
                  <Button type="button" onClick={() => auth.signOut()}>
                    Log Out
                  </Button>
                </div>
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
                <Input
                  fluid
                  action={<Button onClick={this.addTask}>Add</Button>}
                  placeholder="New Task"
                  name="newTask"
                  onChange={this.handleChange}
                  value={this.state.newTask}
                />
              </Segment>
              <Timer addTimeEvent={this.addTimeEvent} />
            </div>
            <img src="Blinking-Cat-Gif.gif" alt="a blinking cat" />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
