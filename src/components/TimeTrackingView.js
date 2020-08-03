import React, { useContext } from "react";
import { firestore } from "../firebase";

import { Header, Segment, Button, Input } from "semantic-ui-react";
import Timer from "./Timer";
import ActiveTasks from "./ActiveTasks";
import { TasksContext } from "../providers/TasksProvider";
import moment from "moment";

export default function TimeTrackingView(props) {
  const { activeTasks } = useContext(TasksContext);
  const [activeMenuItem, setActiveMenuItem] = React.useState("");
  const [newTask, setNewTask] = React.useState("");
  const { user } = props;

  const userRef = firestore.doc(`users/${user.uid}`);
  const taskRef = userRef.collection("tasks");

  function addTask() {
    try {
      taskRef.add({ taskName: newTask, active: true });
    } catch (error) {
      console.error(error);
    }
    setNewTask("");
  }

  function setTaskAsInactive(id) {
    try {
      taskRef.doc(`/${id}`).update({ active: false });
    } catch (error) {
      console.error(error);
    }
  }

  async function addTimeEvent(min, sec) {
    try {
      const today = moment().format("M D YYYY");
      const task = activeMenuItem;
      let secondsSpent = min * 60 + sec;

      const todayRef = userRef.collection("activeDates").doc(today);
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
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <React.Fragment>
      <Header as="h1" className="section-title">
        Today
      </Header>
      <Segment className="task-segment">
        <ActiveTasks
          activeTasks={activeTasks}
          activeMenuItem={activeMenuItem}
          handleMenuItemClick={setActiveMenuItem}
          setTaskAsInactive={setTaskAsInactive}
        />
        <Input
          fluid
          action={<Button onClick={addTask}>Add</Button>}
          placeholder="New Task"
          name="newTask"
          onChange={(e) => setNewTask(e.target.value)}
          value={newTask}
        />
      </Segment>
      <Timer addTimeEvent={addTimeEvent} />
    </React.Fragment>
  );
}
