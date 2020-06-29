import React, { createContext, useContext } from "react";
import { firestore } from "../firebase";
import { UserContext } from "./UserProvider";

export const TasksContext = createContext();

class TasksProvider extends React.Component {
  constructor() {
    super();
    this.state = { tasks: [] };
  }

  get userRef() {
    return firestore.doc(`users/${this.state.user.id}`);
  }

  get taskRef() {
    return this.userRef.collection("tasks");
  }

  unsubscribeFromTasks = null;

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

  render() {
    const { tasks } = this.state;
    const { children } = this.props;

    return (
      <TasksContext.Provider value={tasks}>{children}</TasksContext.Provider>
    );
  }
}

export default TasksProvider;
