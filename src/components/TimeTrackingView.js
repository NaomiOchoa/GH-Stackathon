import React from "react";
import { Header, Segment, Button, Input } from "semantic-ui-react";
import Timer from "./Timer";
import ActiveTasks from "./ActiveTasks";

export default function TimeTrackingView(props) {
  const {
    activeTasks,
    activeMenuItem,
    handleMenuItemClick,
    addTask,
    handleChange,
    newTask,
    addTimeEvent,
  } = props;

  return (
    <React.Fragment>
      <Header as="h1" className="section-title">
        Today
      </Header>
      <Segment className="task-segment">
        <ActiveTasks
          activeTasks={activeTasks}
          activeMenuItem={activeMenuItem}
          handleMenuItemClick={handleMenuItemClick}
        />
        <Input
          fluid
          action={<Button onClick={addTask}>Add</Button>}
          placeholder="New Task"
          name="newTask"
          onChange={handleChange}
          value={newTask}
        />
      </Segment>
      <Timer addTimeEvent={addTimeEvent} />
    </React.Fragment>
  );
}
