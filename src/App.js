import React from "react";
import "./App.css";
import Authentication from "./components/Authentication";
import Routes from "./routes";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Routes />
      </div>
    );
  }
}

export default App;
