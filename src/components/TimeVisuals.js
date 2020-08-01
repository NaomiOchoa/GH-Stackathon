import React, { useEffect } from "react";
import { auth, firestore } from "../firebase";
import moment from "moment";
import * as d3 from "d3";
const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

export default function TimeVisuals(props) {
  const chartRef = React.createRef();
  const xAxisRef = React.createRef();
  const yAxisRef = React.createRef();

  const fakeData1 = [
    {
      date: new Date(1 / 1 / 2020),
      seconds: 123,
      taskName: "My New Task",
    },
  ];

  const fakeData2 = [
    {
      date: new Date(1 / 1 / 2020),
      seconds: 50,
      taskName: "My New Task 2",
    },
    {
      date: new Date(1 / 1 / 2020),
      seconds: 500,
      taskName: "My New Task 3",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      let dataArray = [];
      let todayRef = firestore.doc(
        `users/${props.userId}/activeDates/${props.time}`
      );
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
  }, [props.userId, props.time]);

  const [data, setData] = React.useState(fakeData1);

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
    console.log("calling update useEffect");
    update(data);
  }, [data]);

  return (
    <div>
      <button
        onClick={() =>
          data[0].taskName === "My New Task"
            ? setData(fakeData2)
            : setData(fakeData1)
        }
      >
        Change Data
      </button>
      <svg
        width={width}
        height={height}
        // width={width + margin.left + margin.right}
        // height={height + margin.top + margin.bottom}
        ref={chartRef}
        // transform={`translate(${margin.left}, ${margin.top})`}
      >
        <g
          ref={xAxisRef}
          transform={`translate(0, ${height - margin.bottom})`}
        />
        <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
      </svg>
    </div>
  );
}
