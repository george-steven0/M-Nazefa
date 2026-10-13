import type { TFunction } from "i18next";
import type { ApexOptions } from "apexcharts";
import { Empty, Skeleton } from "antd";
import ReactApexChart from "react-apexcharts";
import type { topCustomerByAmountProps } from "../../../../components/Utilities/Types/types";

type customersBarChartProps = {
  t: TFunction;
  data?: topCustomerByAmountProps[];
  isLoading: boolean;
};

const formatAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

// Top customers by reservations amount (final price) in the selected period
const CustomersBarChart = ({ t, data, isLoading }: customersBarChartProps) => {
  const customers = data ?? [];
  const names = customers.map(
    (item) => item.customerName || `#${item.customerId}`,
  );

  const options: ApexOptions = {
    chart: { type: "bar", height: "100%", toolbar: { show: false } },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => formatAmount(Number(value)),
    },
    xaxis: {
      categories: names,
      labels: { formatter: (value) => formatAmount(Number(value)) },
    },
    tooltip: {
      y: {
        title: { formatter: () => "" },
        formatter: (value, opts) =>
          `${formatAmount(value)} ${t("EGP")} — ${t("RESERVATIONS_COUNT")}: ${
            customers[opts?.dataPointIndex ?? 0]?.reservationsCount ?? 0
          }`,
      },
    },
  };

  return (
    <div className="h-full flex flex-col">
      <section className="block-title mb-2">
        <p className="text-lg font-bold text-mainTextDark capitalize ">
          {t("TOP_CUSTOMERS_BY_AMOUNT")}
        </p>
      </section>

      <section className="recent_customer_chart_bar grow">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : customers.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("NO_DATA_IN_PERIOD")}
          />
        ) : (
          <ReactApexChart
            // Remount when the customers change so ApexCharts redraws the categories
            key={names.join("|")}
            options={options}
            series={[
              {
                name: t("RESERVATIONS_AMOUNT"),
                data: customers.map((item) => item.totalAmount),
              },
            ]}
            type="bar"
            height={"100%"}
          />
        )}
      </section>
    </div>
  );
};

export default CustomersBarChart;
