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
import PrimaryNav from "./PrimaryNav";
import AllTasks from "./AllTasks";
import ActiveTasks from "./ActiveTasks";
import TimeVisualsView from "./TimeVisualsView";
import TimeTrackingView from "./TimeTrackingView";
// import moment from "moment-timezone";
import moment from "moment";

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
      view: "tasks",
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

  async addTimeEvent(min, sec) {
    try {
      const addedAt = new Date();
      const today = moment().format("M D YYYY");
      console.log(today);
      const task = this.state.activeMenuItem;
      let secondsSpent = min * 60 + sec;
      // firestore
      //   .doc(
      //     `users/${this.state.user.uid}/tasks/${this.state.activeMenuItem.id}`
      //   )
      //   .collection("timeEvents")
      //   .add({
      //     addedAt,
      //     secondsSpent,
      //   });
      // this.userRef.collection("timeEvents").add({

      // });

      const todayRef = this.userRef.collection("activeDates").doc(today);
      const todayTaskRef = todayRef.collection("dateTasks").doc(task.id);
      const doc = await todayTaskRef.get();
      if (!doc.exists) {
        todayTaskRef.set(
          {
            taskName: task.taskName,
            secondsSpent,
          },
          { merge: true }
        );
      } else {
        const prevTime = doc.data().secondsSpent;
        todayTaskRef.set(
          {
            secondsSpent: prevTime + secondsSpent,
          },
          { merge: true }
        );
      }
      const status = await todayRef.collection("dateTasks").get();
      status.forEach((doc) => {
        console.log(doc.data());
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
              <Grid.Row
                onClick={() => {
                  this.setState({ view: "stats" });
                }}
              >
                Daily
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
    ];

    return (
      <div id="full-content">
        {/* <PrimaryNav user={user} /> */}
        <div className="main-wrapper">
          {/* <nav fixed="top" className="navbar">
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
              </nav> */}

          {this.state.view === "tasks" ? (
            <TimeTrackingView
              activeTasks={activeTasks}
              activeMenuItem={activeMenuItem}
              handleMenuItemClick={this.handleMenuItemClick}
              addTask={this.addTask}
              handleChange={this.handleChange}
              newTask={this.state.newTask}
              addTimeEvent={this.addTimeEvent}
            />
          ) : (
            <TimeVisualsView
              userId={this.state.user.uid}
              time={moment().format("M D YYYY")}
            />
          )}
        </div>
      </div>
    );
  }
}
