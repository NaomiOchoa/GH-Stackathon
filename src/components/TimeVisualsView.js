import React, { useEffect } from "react";
import { firestore } from "../firebase";
import { Header, Button, Grid, Menu, Icon } from "semantic-ui-react";
import moment from "moment";
import * as d3 from "d3";
const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

export default function TimeVisuals(props) {
  const chartRef = React.createRef();
  const xAxisRef = React.createRef();
  const yAxisRef = React.createRef();
  const [time, setTime] = React.useState(props.time);
  const [data, setData] = React.useState([]);
  const [view, setView] = React.useState("daily");

  useEffect(() => {
    console.log("fetching data");
    async function fetchData() {
      let dataArray = [];
      let todayRef = firestore.doc(`users/${props.userId}/activeDates/${time}`);
      const tasks = await todayRef.collection("dateTasks").get();
      tasks.forEach((doc) => {
        const data = doc.data();
        dataArray.push({
          seconds: data.secondsSpent,
          taskName: data.taskName,
        });
      });
      setData(dataArray);
    }
    fetchData();
  }, [props.userId, time]);

  function update(data) {
    const svg = d3.select(chartRef.current);
    const xAxis = d3.select(xAxisRef.current);
    const yAxis = d3.select(yAxisRef.current);

    let x = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.2);

    let y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    // Update the X axis
    x.domain(
      data.map(function (d) {
        return d.taskName;
      })
    );
    xAxis.call(d3.axisBottom(x));

    // Update the Y axis
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.seconds;
      }),
    ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var u = svg.selectAll("rect").data(data);

    u.enter()
      .append("rect") // Add a new rect for each new elements
      .merge(u) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr("x", function (d) {
        return x(d.taskName);
      })
      .attr("y", function (d) {
        return y(d.seconds);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - margin.bottom - y(d.seconds);
      })
      .attr("fill", "#69b3a2");

    // If less group in the new dataset, I delete the ones not in use anymore
    u.exit().remove();
  }

  useEffect(() => {
    update(data);
  }, [data]);

  function decreaseDay() {
    let newDate = moment(time, "M D YYYY")
      .subtract(1, "days")
      .format("M D YYYY");
    setTime(newDate);
  }

  function increaseDay() {
    let newDate = moment(time, "M D YYYY").add(1, "days").format("M D YYYY");
    setTime(newDate);
  }

  return (
    <Grid>
      <Grid.Column stretched width={2}>
        <Menu fluid vertical tabular>
          <Menu.Item
            name="Daily"
            active={view === "daily"}
            onClick={() => {
              setView("daily");
            }}
          />
          <Menu.Item
            name="Weekly"
            active={view === "weekly"}
            disabled
            onClick={() => setView("weekly")}
          />
          <Menu.Item
            name="Monthly"
            active={view === "monthly"}
            disabled
            onClick={() => setView("monthly")}
          />
          <Menu.Item
            name="Yearly"
            active={view === "yearly"}
            disabled
            onClick={() => setView("yearly")}
          />
        </Menu>
      </Grid.Column>
      <Grid.Column stretched centered width={14}>
        <Grid.Row id="time-control-container">
          <Button
            icon="angle left"
            onClick={decreaseDay}
            className="time-control-button"
          />
          <Header as="h1" className="section-title">
            {moment(time, "M D YYYY").format("MMM Do, YYYY")}
            <Header.Subheader>Seconds Spent per Task</Header.Subheader>
          </Header>
          <Button
            icon="angle right"
            onClick={increaseDay}
            className="time-control-button"
          />
        </Grid.Row>
        <div id="svg-container">
          <svg width={width} height={height} ref={chartRef}>
            <g
              ref={xAxisRef}
              transform={`translate(0, ${height - margin.bottom})`}
            />
            <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
          </svg>
        </div>
      </Grid.Column>
    </Grid>
  );
}
