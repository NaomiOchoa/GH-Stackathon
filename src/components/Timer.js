import React from "react";

import { Button, Input } from "semantic-ui-react";

export default class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      reminderTimerMin: "",
      reminderTimerSec: "",
      breakTimerMin: "",
      breakTimerSec: "",
      runningTimerMin: 0,
      runningTimerSec: 0,
      isRunning: false,
      timerId: 0,
      setTimerMin: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.startTaskTimer = this.startTaskTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  startTaskTimer() {
    this.setState({
      isRunning: true,
      setTimerMin: this.state.reminderTimerMin,
    });
    let timer = setInterval(() => {
      const notifySound = new Audio("juntos.mp3");
      const {
        reminderTimerMin,
        reminderTimerSec,
        runningTimerMin,
        runningTimerSec,
      } = this.state;
      if (reminderTimerSec > 0) {
        this.setState({ reminderTimerSec: reminderTimerSec - 1 });
      } else if (reminderTimerMin === 0 && reminderTimerSec === 0) {
        notifySound.play();
        this.setState({
          reminderTimerMin: this.state.setTimerMin,
          reminderTimerSec: 0,
        });
      } else {
        this.setState({
          reminderTimerMin: reminderTimerMin - 1,
          reminderTimerSec: 59,
        });
      }
      if (runningTimerSec === 59) {
        this.setState({
          runningTimerMin: runningTimerMin + 1,
          runningTimerSec: 0,
        });
      } else {
        this.setState({ runningTimerSec: runningTimerSec + 1 });
      }
    }, 1000);
    this.setState({ timerId: timer });
  }

  stopTimer() {
    clearInterval(this.state.timerId);
    this.setState({
      reminderTimerMin: "",
      reminderTimerSec: "",
      runningTimerMin: 0,
      runningTimerSec: 0,
      isRunning: false,
    });
  }

  render() {
    const {
      reminderTimerMin,
      reminderTimerSec,
      breakTimerMin,
      breakTimerSec,
      runningTimerMin,
      runningTimerSec,
      isRunning,
      setTimerMin,
    } = this.state;
    return (
      <React.Fragment>
        <Input
          className="reminder-interval"
          placeholder="Reminder Interval"
          label="minutes"
          labelPosition="right"
          name="reminderTimerMin"
          value={isRunning ? setTimerMin : reminderTimerMin}
          onChange={this.handleChange}
        />
        <Input
          className="break-interval"
          placeholder="Break Length"
          label="minutes"
          labelPosition="right"
          name="breakTimerMin"
          value={breakTimerMin}
          onChange={this.handleChange}
        />
        <Input
          className="running-total"
          placeholder="Time Spent"
          label="spent"
          labelPosition="right"
          name="runningTotal"
          disabled
          value={`${runningTimerMin}:${runningTimerSec}`}
        />
        <Button className="start-button" onClick={this.startTaskTimer}>
          {isRunning ? `${reminderTimerMin}:${reminderTimerSec}` : "Start!"}
        </Button>
        <Button className="done-button" onClick={this.stopTimer}>
          Done with this task for now!
        </Button>
        <Button className="break-button">
          {isRunning ? `${breakTimerMin}:${breakTimerSec}` : "Take a Break"}
        </Button>
        {/* <div>{`${runningTimerMin}:${runningTimerSec}`}</div> */}
      </React.Fragment>
    );
  }
}
