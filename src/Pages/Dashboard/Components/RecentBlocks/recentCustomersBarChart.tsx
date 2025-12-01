import { useState } from "react";
import type {
  ChartState,
  translationType,
} from "../../../../components/Utilities/Types/types";
import ReactApexChart from "react-apexcharts";

const CustomersBarChart = ({ t }: translationType) => {
  const [state] = useState<ChartState>({
    series: [
      {
        data: [400, 430, 220, 470, 1380],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: "100%",
      },
      //   tooltip: {
      //     enabled: true,
      //   },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: ["Group 1", "Group 2", "Group 3", "Group 4", "Group 5"],
      },
    },
  });
  return (
    <div className="h-full flex flex-col">
      <section className="block-title mb-2">
        <p className="text-lg font-bold text-mainTextDark capitalize ">
          {t("RECEN_CUSTOMERS")}
        </p>
      </section>

      <section className="recent_customer_chart_bar grow">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={"100%"}
        />
      </section>
    </div>
  );
};

export default CustomersBarChart;
