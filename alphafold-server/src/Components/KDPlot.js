import React from "react";
import { Scatter } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import { KdPlotValueCalc } from "../Utils/peptideDataExtractFuncs";
import Chart from "chart.js/auto";

Chart.register(LinearScale);

export const KDPlot = (props) => {
  let resultData = KdPlotValueCalc(props.sequence);

  //Data for the chart
  const data = {
    datasets: [
      {
        data: resultData,
        fill: false,
        borderColor: "rgb(0, 0, 255)",
        borderWidth: 2,
        pointRadius: 0,
        showLine: true,
      },
    ],
  };

  // Configuration options for the chart
  const options = {
    layout: {
      padding: {
        left: 10,
        right: 30,
        top: 30,
        bottom: 10,
      },
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            drawTime: "beforeDraw",
            type: "line",
            yMin: 0,
            yMax: 0,
            borderWidth: 1,
            borderColor: "rgba(0,0,0)",
          },
        },
      },
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        type: "linear",
        min: 0,
        max: (props.sequence.length / 10) * 10,
        position: "bottom",
        title: {
          display: true,
          text: "position",
        },
      },
      y: {
        type: "linear",
        position: "left",
        max: 5,
        min: -5,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
  };

  return (
    <div>
      <Scatter data={data} options={options} />
    </div>
  );
};
