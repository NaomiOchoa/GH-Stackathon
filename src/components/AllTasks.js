import React, { useContext } from "react";
import { firestore } from "../firebase";
import { Button, Grid } from "semantic-ui-react";
import { TasksContext } from "../providers/TasksProvider";

export default function AllTasks(props) {
  const { tasks } = useContext(TasksContext);
  const { user } = props;

  const userRef = firestore.doc(`users/${user.uid}`);
  const taskRef = userRef.collection("tasks");

  function setTaskAsActive(id) {
    try {
      taskRef.doc(`/${id}`).update({ active: true });
    } catch (error) {
      console.error(error);
    }
  }

  function setTaskAsInactive(id) {
    try {
      taskRef.doc(`/${id}`).update({ active: false });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Grid divided="vertically">
      {tasks.map((task) => {
        return (
          <Grid.Row key={task.id} verticalAlign="middle" columns={3}>
            <Grid.Column textAlign="left" floated="left">
              {task.taskName}
            </Grid.Column>
            <Grid.Column textAlign="right" floated="right">
              {task.active ? (
                <Button size="mini" onClick={() => setTaskAsInactive(task.id)}>
                  Remove from Today
                </Button>
              ) : (
                <Button size="mini" onClick={() => setTaskAsActive(task.id)}>
                  Add to Today
                </Button>
              )}
            </Grid.Column>
          </Grid.Row>
        );
      })}
    </Grid>
  );
}
