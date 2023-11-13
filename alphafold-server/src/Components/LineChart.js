import React from "react";
import { Line } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import Chart from "chart.js/auto";
import { difficultyCouplingCalc } from "../Utils/peptideDataExtractFuncs";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);
Chart.register(LinearScale);

const pointBgColors = (data) => {
  return data.map((value) => {
    if (value > 1.2) {
      return "rgb(255, 0, 0)";
    } else if (value <= 0.8) {
      return "rgb(0, 255, 0)";
    } else {
      return "rgb(255, 255, 0)";
    }
  });
};
export const LineChart = (props) => {
  let resultData = difficultyCouplingCalc(props.sequence);
  console.log(resultData);

  // Sample data for the chart
  const data = {
    labels: resultData[1],
    datasets: [
      {
        label: "Aggregation potential",
        data: resultData[0],
        fill: false,
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 1,
        pointRadius: 4,
        pointBackgroundColor: pointBgColors(resultData[0]),
        pointBorderColor: "rgb(0,0,0)",
      },
    ],
  };

  // Configuration options for the chart
  const options = {
    layout: {
      padding: {
        left: 10,
        right: 20,
        top: 0,
        bottom: 10,
      },
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            drawTime: "beforeDraw",
            type: "line",
            yMin: 0.8,
            yMax: 0.8,
            borderWidth: 1,
            borderColor: "rgba(0,0,255)",
          },
          line2: {
            drawTime: "beforeDraw",
            type: "line",
            yMin: 1.0,
            yMax: 1.0,
            borderWidth: 1,
            borderColor: "rgba(0,0,255)",
          },
          line3: {
            drawTime: "beforeDraw",
            type: "line",
            yMin: 1.2,
            yMax: 1.2,
            borderWidth: 1,
            borderColor: "rgba(0,0,255)",
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Aggregation potential",
        align: "start",
        color: "rgb(0,0,0)",
        font: {
          size: 12,
        },
      },
    },

    scales: {
      y: {
        min: 0,
        max: 2,
        ticks: {
          stepSize: 0.2,
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};
