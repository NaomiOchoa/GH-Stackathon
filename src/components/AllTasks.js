import React from "react";
import { Button, Grid } from "semantic-ui-react";

export default function AllTasks(props) {
  const { tasks, setTaskAsActive, setTaskAsInactive } = props;

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
