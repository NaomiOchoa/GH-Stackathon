import React from "react";

import { Button, Input, Grid, Segment } from "semantic-ui-react";

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reminderTimerMin: 30,
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
    const { runningTimerMin, runningTimerSec, timerId } = this.state;
    clearInterval(timerId);
    this.props.addTimeEvent(runningTimerMin, runningTimerSec);
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
      runningTimerMin,
      runningTimerSec,
      isRunning,
      setTimerMin,
    } = this.state;
    const { activeMenuItem } = this.props;
    return (
      <Segment>
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Grid.Row>
                <Input
                  className="reminder-interval"
                  placeholder="Reminder Interval"
                  label="minutes"
                  labelPosition="right"
                  name="reminderTimerMin"
                  disabled
                  value={
                    isRunning ? `${setTimerMin}:00` : `${reminderTimerMin}:00`
                  }
                />
              </Grid.Row>
              <Grid.Row>
                <input
                  type="range"
                  min={0}
                  max={60}
                  name="reminderTimerMin"
                  value={reminderTimerMin}
                  onChange={this.handleChange}
                />
              </Grid.Row>
            </Grid.Column>
            <Grid.Column>
              <Input
                className="running-total"
                placeholder="Time Spent"
                label="spent"
                labelPosition="right"
                name="runningTotal"
                disabled
                value={`${runningTimerMin}:${("00" + runningTimerSec).slice(
                  -2
                )}`}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button
                className="start-button"
                disabled={!activeMenuItem}
                onClick={this.startTaskTimer}
              >
                {isRunning
                  ? `${reminderTimerMin}:${("00" + reminderTimerSec).slice(-2)}`
                  : "Start!"}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                className="done-button"
                disabled={!isRunning}
                onClick={this.stopTimer}
              >
                Done with this task for now!
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}
