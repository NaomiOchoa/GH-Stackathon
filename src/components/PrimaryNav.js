import React from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase";

export default function PrimaryNav(props) {
  const [activeItem, setActiveItem] = React.useState();
  const { user } = props;

  return (
    <Menu pointing secondary>
      <Menu.Item
        as={NavLink}
        to={"/track-time"}
        name="track time"
        active={activeItem === "track time"}
        onClick={() => setActiveItem("track time")}
      />
      <Menu.Item
        name="view stats"
        as={NavLink}
        to={"/view-stats"}
        active={activeItem === "view stats"}
        onClick={() => setActiveItem("view stats")}
      />
      <Menu.Item
        name="manage tasks"
        as={NavLink}
        to={"/manage-tasks"}
        active={activeItem === "manage tasks"}
        onClick={() => setActiveItem("manage tasks")}
      />
      <Menu.Menu position="right">
        <Dropdown item text={user.displayName}>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => auth.signOut()}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
}
