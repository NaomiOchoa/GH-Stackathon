import React, { useContext } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import LoginSignupForm from "./components/LoginSignupForm";
import { UserContext } from "./providers/UserProvider";
import UserHome from "./components/UserHome";

function Routes(props) {
  const user = useContext(UserContext);
  return (
    <Switch>
      {user && (
        <Switch>
          {/* Routes placed here are only available after logging in */}
          <Route path="/" component={() => <UserHome user={user} />} />
        </Switch>
      )}
      {/* Displays our Login component as a fallback */}
      <Route component={LoginSignupForm} />
    </Switch>
  );
}

export default withRouter(Routes);
