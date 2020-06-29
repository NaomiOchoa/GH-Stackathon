import React from "react";
import { Menu } from "semantic-ui-react";

export default function ActiveTasks(props) {
  const { handleMenuItemClick, activeTasks, activeMenuItem } = props;

  return (
    <React.Fragment>
      {activeTasks.map((task) => {
        return (
          <Menu key={task.id} vertical color="green" fluid>
            <Menu.Item
              name={task.taskName}
              value={task.id}
              active={activeMenuItem.id === task.id}
              onClick={handleMenuItemClick}
            />
          </Menu>
        );
      })}
    </React.Fragment>
  );
}
