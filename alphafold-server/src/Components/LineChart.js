import React from "react";
import { Line } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import Chart from "chart.js/auto";
import { difficultyCouplingCalc } from "../Utils/peptideCompanion";

Chart.register(LinearScale);

const pointBgColors = (data) => {
  return data.map((value) => {
    if (value > 1.2) {
      return "rgb(255, 0, 0)";
    } else if (value < 0.8) {
      return "rgb(0, 255, 0)";
    } else {
      return "rgb(65, 105, 225)";
    }
  });
};
export const LineChart = (props) => {
  let resultData = difficultyCouplingCalc(props.sequence);

  // Sample data for the chart
  const data = {
    labels: resultData[1],
    datasets: [
      {
        label: "Peptide Coupling difficulty",
        data: resultData[0],
        fill: false,
        borderColor: "rgb(105, 105, 105)",
        pointRadius: 6,
        pointBackgroundColor: pointBgColors(resultData[0]),
      },
    ],
  };

  // Configuration options for the chart
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Peptide Coupling difficulty",
      },
    },

    scales: {
      y: {
        min: resultData[2][0] - 0.1 > 0 ? resultData[2][0] - 0.1 : 0,
        max: resultData[2][1] + 0.1,
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};
