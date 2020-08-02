import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function PrimaryNav() {
  const [activeItem, setActiveItem] = React.useState("track time");

  return (
    <Menu pointing secondary>
      <Menu.Item
        as={Link}
        to={"/track-time"}
        name="track time"
        active={activeItem === "track time"}
        onClick={() => setActiveItem("track time")}
      />
      <Menu.Item
        name="view stats"
        as={Link}
        to={"/view-stats"}
        active={activeItem === "view stats"}
        onClick={() => setActiveItem("view stats")}
      />
      <Menu.Item
        name="manage tasks"
        as={Link}
        to={"/manage-tasks"}
        active={activeItem === "manage tasks"}
        onClick={() => setActiveItem("manage tasks")}
      />
    </Menu>
  );
}
