import React, { createContext } from "react";
import { firestore } from "../firebase";

export const TasksContext = createContext();

class TasksProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tasks: [], activeTasks: [] };
  }

  get userRef() {
    return firestore.doc(`users/${this.props.user.uid}`);
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
      const activeTasks = tasks.filter((task) => task.active);
      this.setState({ tasks });
      this.setState({ activeTasks });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribeFromTasks();
  };

  render() {
    const { tasks, activeTasks } = this.state;
    const { children } = this.props;

    return (
      <TasksContext.Provider value={{ tasks, activeTasks }}>
        {children}
      </TasksContext.Provider>
    );
  }
}

export default TasksProvider;
