import React from "react";
import { auth } from "../firebase";
import {
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Button,
  Tab,
  Grid,
  List,
  Input,
  Statistic,
} from "semantic-ui-react";
import Timer from "./Timer";

export default class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      open: false,
      activeMenuItem: "0",
    };
    this.toggleDrawerState = this.toggleDrawerState.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  toggleDrawerState() {
    if (this.state.open) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
  }

  handleMenuItemClick(e, { name }) {
    console.log(name);
    this.setState({ activeMenuItem: name });
  }

  render() {
    const { open, user, activeMenuItem } = this.state;
    console.log(this.state);
    const panes = [
      {
        menuItem: "Tasks",
        render: () => (
          <Tab.Pane>
            <Grid divided="vertically">
              <Grid.Row verticalAlign="center" columns={3}>
                <Grid.Column textAlign="left" floated="left">
                  Task Name
                </Grid.Column>
                <Grid.Column textAlign="right" floated="right">
                  <Button size="mini">Add to Today</Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row verticalAlign="center" columns={3}>
                <Grid.Column textAlign="left" floated="left">
                  Task Name
                </Grid.Column>
                <Grid.Column textAlign="right" floated="right">
                  <Button size="mini">Add to Today</Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row verticalAlign="center" columns={3}>
                <Grid.Column textAlign="left" floated="left">
                  Task Name
                </Grid.Column>
                <Grid.Column textAlign="right" floated="right">
                  <Button size="mini">Add to Today</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Tab.Pane>
        ),
      },
      { menuItem: "Stats", render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
    ];

    return (
      <div id="full-content">
        <Sidebar.Pushable>
          <Sidebar
            animation="push"
            onHide={() => this.toggleDrawerState}
            visible={open}
            width="wide"
            as={Tab}
            panes={panes}
          />
          <Sidebar.Pusher>
            <div className="main-wrapper">
              <nav
                fixed="top"
                className="navbar"
                onClick={this.toggleDrawerState}
              >
                Main Menu
              </nav>
              <Header as="h1" className="section-title">
                Today
              </Header>
              <Segment className="task-segment">
                <Menu vertical color="olive" fluid>
                  <Menu.Item
                    name="a"
                    active={activeMenuItem === "a"}
                    onClick={this.handleMenuItemClick}
                  />
                </Menu>
                <Menu vertical color="olive" fluid>
                  <Menu.Item
                    name="b"
                    active={activeMenuItem === "b"}
                    onClick={this.handleMenuItemClick}
                  />
                </Menu>
                <Menu vertical color="olive" fluid>
                  <Menu.Item
                    name="c"
                    active={activeMenuItem === "c"}
                    onClick={this.handleMenuItemClick}
                  />
                </Menu>
                <Input fluid action="Add" placeholder="new task"></Input>
              </Segment>
              <Timer />
              {/* <Input
                className="reminder-interval"
                placeholder="Reminder Interval"
                label="minutes"
                labelPosition="right"
              />
              <Input
                className="break-interval"
                placeholder="Break Length"
                label="minutes"
                labelPosition="right"
              />
              <Button className="start-button">Start!</Button>
              <Button className="break-button">Take a break</Button>
              <Button className="done-button">Done for today!</Button> */}
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
