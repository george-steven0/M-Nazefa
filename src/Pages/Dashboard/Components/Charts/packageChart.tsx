import { useState } from "react";
import Chart from "react-apexcharts";
import type { ChartState } from "../../../../components/Utilities/Types/types";

const PackageChart = () => {
  const [state] = useState<ChartState>({
    series: [
      {
        name: "Year Data",
        data: [20, 40, 60, 80, 30, 120, 150, 170, 65, 220, 240, 0],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.5,
        },
        zoom: { enabled: true, type: "x" },
        toolbar: { show: false },
      },
      colors: ["#072D3C"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      title: {
        text: "Monthly Data",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.3,
        },
      },
      markers: {
        size: 6, // main circle size
        strokeWidth: 4, // outer ring thickness
        strokeColors: "#cacace",
        colors: ["#072D3C"], // inner circle color
        hover: {
          size: 10, // size when hovering
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        // range: 5,
        // max: 5,

        // title: { text: "Month" },
      },
      yaxis: {
        // title: { text: "Values" },
        min: 0,
        max: 250,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  });
  return (
    <div className="w-full h-full min-h-[250px] p-4 border border-mainBorderLight rounded-lg">
      <Chart
        options={state.options}
        series={state.series}
        type="line"
        height={"100%"}
      />
    </div>
  );
};

export default PackageChart;
