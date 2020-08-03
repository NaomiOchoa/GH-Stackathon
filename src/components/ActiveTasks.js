import React from "react";
import { Menu, Button, Transition } from "semantic-ui-react";

export default function ActiveTasks(props) {
  const {
    handleMenuItemClick,
    activeTasks,
    activeMenuItem,
    setTaskAsInactive,
  } = props;
  const [hoverTask, setHoverTask] = React.useState(null);

  return (
    <div>
      {activeTasks.map((task) => {
        return (
          <Menu
            key={task.id}
            vertical
            color="green"
            fluid
            className="active-menu"
            onMouseEnter={() => setHoverTask(task.id)}
            onMouseLeave={() => setHoverTask(null)}
          >
            <Menu.Item
              name={task.taskName}
              value={task.id}
              active={activeMenuItem.id === task.id}
              onClick={() => handleMenuItemClick(task)}
            />
            <Transition.Group animation="vertical flip" duration="500">
              {hoverTask === task.id && (
                <Menu.Item>
                  <Button onClick={() => setTaskAsInactive(task.id)}>
                    Remove from Today
                  </Button>
                </Menu.Item>
              )}
            </Transition.Group>
          </Menu>
        );
      })}
    </div>
  );
}
