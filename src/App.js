import React from "react";
import "./App.css";
import Authentication from "./components/Authentication";
import { auth, firestore } from "./firebase";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Authentication />
      </div>
    );
  }
}

export default App;
