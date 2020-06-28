import React from "react";
import { Menu } from "semantic-ui-react";

export default function ActiveTasks(props) {
  const { handleMenuItemClick, activeTasks, activeMenuItem } = props;

  return (
    <React.Fragment>
      {activeTasks.map((task) => {
        return (
          <Menu vertical color="green" fluid>
            <Menu.Item
              name={task.taskName}
              active={activeMenuItem === task.taskName}
              onClick={handleMenuItemClick}
            />
          </Menu>
        );
      })}
    </React.Fragment>
  );
}
