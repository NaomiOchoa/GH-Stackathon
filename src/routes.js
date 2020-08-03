import React, { useContext } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import LoginSignupForm from "./components/LoginSignupForm";
import { UserContext } from "./providers/UserProvider";
import TasksProvider from "./providers/TasksProvider";
import UserHome from "./components/UserHome";
import PrimaryNav from "./components/PrimaryNav";
import TimeVisualsView from "./components/TimeVisualsView";
import moment from "moment";
import TimeTrackingView from "./components/TimeTrackingView";
import AllTasks from "./components/AllTasks";

function Routes(props) {
  const user = useContext(UserContext);
  return (
    <Switch>
      {user && (
        <React.Fragment>
          <PrimaryNav user={user} />
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route
              exact
              path="/"
              component={() => {
                return (
                  <TasksProvider user={user}>
                    <TimeTrackingView user={user} />
                  </TasksProvider>
                );
              }}
            />
            <Route
              path="/track-time"
              component={() => {
                return (
                  <TasksProvider user={user}>
                    <TimeTrackingView user={user} />
                  </TasksProvider>
                );
              }}
            />
            <Route
              path="/view-stats"
              component={() => {
                return (
                  <TimeVisualsView
                    userId={user.uid}
                    time={moment().format("M D YYYY")}
                  />
                );
              }}
            />
            <Route
              path="/manage-tasks"
              component={() => {
                return (
                  <TasksProvider user={user}>
                    <AllTasks user={user} />
                  </TasksProvider>
                );
              }}
            />
          </Switch>
        </React.Fragment>
      )}
      {/* Displays our Login component as a fallback */}
      <Route component={LoginSignupForm} />
    </Switch>
  );
}

export default withRouter(Routes);
