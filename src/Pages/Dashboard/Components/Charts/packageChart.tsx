import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { TFunction } from "i18next";
import { Empty, Skeleton } from "antd";
import { useAppSelector } from "../../../../components/APIs/store";
import type { monthlyReservationsProps } from "../../../../components/Utilities/Types/types";

type packageChartProps = {
  t: TFunction;
  data?: monthlyReservationsProps[];
  isLoading: boolean;
};

const AMOUNT_COLOR = "#072D3C";
const COUNT_COLOR = "#EF9B4F";

const formatAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 0 });

// Monthly reservations of the selected period: amount (left axis) and count (right axis)
const PackageChart = ({ t, data, isLoading }: packageChartProps) => {
  const { lang } = useAppSelector((state) => state.lang);

  const months = data ?? [];
  const hasData = months.some((m) => m.reservationsCount > 0);
  // Show the year in the labels only when the period spans more than one year
  const multiYear = new Set(months.map((m) => m.year)).size > 1;
  const monthFormat = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "ar-EG", {
    month: "short",
    ...(multiYear ? { year: "numeric" } : {}),
  });
  const categories = months.map((m) =>
    monthFormat.format(new Date(m.year, m.month - 1, 1)),
  );

  const options: ApexOptions = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: [AMOUNT_COLOR, COUNT_COLOR],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    title: {
      text: t("MONTHLY_DATA"),
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
      size: 4,
      strokeWidth: 2,
      strokeColors: "#cacace",
      hover: { size: 7 },
    },
    xaxis: { categories },
    yaxis: [
      {
        min: 0,
        title: { text: `${t("RESERVATIONS_AMOUNT")} (${t("EGP")})` },
        labels: { formatter: (value) => formatAmount(value) },
      },
      {
        opposite: true,
        min: 0,
        forceNiceScale: true,
        title: { text: t("RESERVATIONS_COUNT") },
        labels: { formatter: (value) => Math.round(value).toString() },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value, opts) =>
          opts?.seriesIndex === 0
            ? `${formatAmount(value)} ${t("EGP")}`
            : Math.round(value).toString(),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  return (
    <div className="w-full h-full min-h-[250px] p-4 border border-mainBorderLight rounded-lg">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : !hasData ? (
        <div className="h-full flex flex-col">
          <p className="font-bold text-mainTextDark capitalize">
            {t("MONTHLY_DATA")}
          </p>
          <div className="grow flex items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t("NO_DATA_IN_PERIOD")}
            />
          </div>
        </div>
      ) : (
        <Chart
          // Remount when the months or language change so ApexCharts redraws the axis
          key={`${lang}-${categories.join("|")}`}
          options={options}
          series={[
            {
              name: t("RESERVATIONS_AMOUNT"),
              data: months.map((m) => m.totalAmount),
            },
            {
              name: t("RESERVATIONS_COUNT"),
              data: months.map((m) => m.reservationsCount),
            },
          ]}
          type="line"
          height={"100%"}
        />
      )}
    </div>
  );
};

export default PackageChart;
