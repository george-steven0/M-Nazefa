import { useState } from "react";
import type {
  ChartState,
  translationType,
} from "../../../../components/Utilities/Types/types";
import ReactApexChart from "react-apexcharts";

const CustomersPieChart = ({ t }: translationType) => {
  const [state] = useState<ChartState>({
    // series: [{ name: "Recent Customers", data: [44, 55, 13, 43] }],
    series: [44, 55, 13, 43],
    options: {
      chart: {
        // width: "100%",
        type: "pie",
      },
      labels: ["A", "B", "C", "D"],
      legend: {
        position: "bottom",
        // formatter(legendName: string) {
        //   return `<div class="recent-customers-legend">
        //     <div class="recent-customers-legend-item">${legendName}</div>
        //   </div>`;
        // },
      },
      markers: {
        shape: "circle",
      },
      colors: ["#072D3C", "#FFB809", "#57C1EA", "#EF9B4F"],
      //   responsive: [{
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 200
      //       },
      //       legend: {
      //         position: 'bottom'
      //       }
      //     }
      //   }]
    },
  });

  return (
    <div className="h-full">
      <section className="block-title mb-2">
        <p className="text-lg font-bold text-mainTextDark capitalize ">
          {t("RECEN_CUSTOMERS")}
        </p>
      </section>

      <section className="recent_customer_chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="pie"
          //   width={380}
        />
      </section>
    </div>
  );
};

export default CustomersPieChart;
