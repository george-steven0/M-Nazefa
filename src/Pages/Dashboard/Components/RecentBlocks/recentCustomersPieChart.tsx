import type { TFunction } from "i18next";
import type { ApexOptions } from "apexcharts";
import { Empty, Skeleton } from "antd";
import ReactApexChart from "react-apexcharts";
import { useAppSelector } from "../../../../components/APIs/store";
import type { customersByTypeProps } from "../../../../components/Utilities/Types/types";

type customersPieChartProps = {
  t: TFunction;
  data?: customersByTypeProps[];
  isLoading: boolean;
};

const TYPE_COLORS = ["#072D3C", "#FFB809", "#57C1EA", "#EF9B4F", "#8E7CC3", "#6AA84F"];

// Customers added in the selected period, split by customer type.
// Customers without a type are not a slice; their count is shown as a note under the chart.
const CustomersPieChart = ({ t, data, isLoading }: customersPieChartProps) => {
  const { lang } = useAppSelector((state) => state.lang);

  const slices = (data ?? []).filter((item) => item.typeId !== null);
  const withoutType = (data ?? [])
    .filter((item) => item.typeId === null)
    .reduce((sum, item) => sum + item.count, 0);
  const total = slices.reduce((sum, item) => sum + item.count, 0);

  const labels = slices.map(
    (item) => (lang === "en" ? item.name : item.arName || item.name) ?? "",
  );
  // Colors follow the type order so a type keeps its color between periods
  const colors = slices.map((_, index) => TYPE_COLORS[index % TYPE_COLORS.length]);

  const options: ApexOptions = {
    chart: { type: "pie" },
    labels,
    colors,
    legend: {
      position: "bottom",
      formatter: (name, opts) =>
        `${name}: ${opts?.w?.globals?.series?.[opts.seriesIndex] ?? 0}`,
    },
    markers: { shape: "circle" },
    tooltip: {
      y: { formatter: (value) => value.toLocaleString() },
    },
  };

  return (
    <div className="h-full">
      <section className="block-title mb-2">
        <p className="text-lg font-bold text-mainTextDark capitalize ">
          {t("CUSTOMERS_BY_TYPE")}
        </p>
      </section>

      <section className="recent_customer_chart">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : total === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("NO_DATA_IN_PERIOD")}
          />
        ) : (
          <ReactApexChart
            // Remount when the slices change so ApexCharts redraws labels and colors
            key={`${lang}-${labels.join("|")}`}
            options={options}
            series={slices.map((item) => item.count)}
            type="pie"
          />
        )}
      </section>

      {!isLoading && withoutType > 0 && (
        <p className="mt-2 text-center text-xs text-mainTextLight">
          {t("CUSTOMERS_WITHOUT_TYPE", { total: withoutType.toLocaleString() })}
        </p>
      )}
    </div>
  );
};

export default CustomersPieChart;
