import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { type Dayjs } from "dayjs";
import Title from "../../components/Common/Title/title";
import HeaderCards from "./Components/HeaderCards/headerCards";
import MostPackages from "./Components/Charts/mostPackages";
import PackageChart from "./Components/Charts/packageChart";
import RecentCustomers from "./Components/RecentBlocks/recentCustomers";
import CustomersPieChart from "./Components/RecentBlocks/recentCustomersPieChart";
import CustomersBarChart from "./Components/RecentBlocks/recentCustomersBarChart";
import {
  useGetCustomersByTypeQuery,
  useGetDashboardSummaryQuery,
  useGetMonthlyReservationsQuery,
  useGetMostRecentCustomersQuery,
  useGetMostUsedPackagesQuery,
  useGetTopCustomersByAmountQuery,
} from "../../components/APIs/Dashboard/DASHBOARD_QUERY";
import { DatePicker, Skeleton } from "antd";
import type { dashboardPeriodParams } from "../../components/Utilities/Types/types";

const { RangePicker } = DatePicker;

type periodRange = [Dayjs, Dayjs] | null;

// Opens on the current year; clearing the picker shows all time
const currentYear = (): periodRange => [
  dayjs().startOf("year"),
  dayjs().endOf("year"),
];

const Dashboard = () => {
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState<periodRange>(currentYear);

  // Plain calendar days (no time / timezone) so the backend filters exactly the picked days
  const period: dashboardPeriodParams = dateRange
    ? {
        fromDate: dateRange[0].format("YYYY-MM-DD"),
        toDate: dateRange[1].format("YYYY-MM-DD"),
      }
    : {};

  const {
    data: summary,
    isLoading: isLoadingSummary,
    isFetching: isFetchingSummary,
  } = useGetDashboardSummaryQuery(period);

  const {
    data: mostRecentCustomers,
    isFetching: isFetchingMostRecentCustomers,
  } = useGetMostRecentCustomersQuery(period);

  const { data: mostUsedPackages, isFetching: isFetchingMostUsedPackages } =
    useGetMostUsedPackagesQuery(period);

  const { data: customersByType, isFetching: isFetchingCustomersByType } =
    useGetCustomersByTypeQuery(period);

  const { data: topCustomers, isFetching: isFetchingTopCustomers } =
    useGetTopCustomersByAmountQuery(period);

  const { data: monthlyReservations, isFetching: isFetchingMonthly } =
    useGetMonthlyReservationsQuery(period);

  const handleDateRangeChange = (
    values: [Dayjs | null, Dayjs | null] | null,
  ) => {
    setDateRange(values?.[0] && values?.[1] ? [values[0], values[1]] : null);
  };

  const tabsList = [
    {
      id: 1,
      label: t("RESERVATIONS_AMOUNT"),
      value: summary?.data?.totalAmount || 0,
      currency: true,
    },
    {
      id: 2,
      label: t("RESERVATIONS_COUNT"),
      value: summary?.data?.reservationsCount || 0,
      currency: false,
    },
    {
      id: 3,
      // With a period it counts customers added in it; without one, all customers
      label: dateRange ? t("NEW_CLIENTS") : t("OUR_CLIENTS"),
      value: summary?.data?.customersCount || 0,
      currency: false,
    },
  ];

  return (
    <main>
      <header>
        <Title title={t("DASHBOARD")} />
      </header>

      <div className="main-content-wrapper mt-8 flex flex-col gap-10">
        {/* ── Period filter: applies to every block below ─────────────────── */}
        <section className="flex flex-wrap items-center gap-4">
          <label className="font-semibold text-sm text-mainColor capitalize">
            {t("FILTER_BY_DATE")}:
          </label>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD-MM-YYYY"
            className="min-h-10"
            allowClear
          />
          {!dateRange && (
            <span className="text-sm text-mainTextLight">{t("ALL_TIME")}</span>
          )}
        </section>

        <section className="tabs-container grid grid-cols-1 lg:grid-cols-3 gap-5">
          {isLoadingSummary || isFetchingSummary ? (
            <div className="col-span-full grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  active
                  className="h-full"
                  paragraph={{ rows: 2 }}
                  title={false}
                />
              ))}
            </div>
          ) : (
            tabsList?.map((data) => <HeaderCards key={data?.id} data={data} />)
          )}
        </section>

        <section className="packages-chart-container flex flex-wrap lg:flex-nowrap items-start gap-5 lg:h-[300px]">
          <div className="most-sold-packages-wrapper basis-full lg:basis-[32%] h-full grow">
            <MostPackages
              t={t}
              data={mostUsedPackages?.data}
              isLoading={isFetchingMostUsedPackages}
            />
          </div>

          <div className="packages-line-chart-wrapper basis-full lg:basis-[68%] h-full grow">
            <PackageChart
              t={t}
              data={monthlyReservations?.data}
              isLoading={isFetchingMonthly}
            />
          </div>
        </section>

        <section className="recent-wrappers flex flex-col lg:flex-row flex-wrap xl:flex-nowrap items-stretch gap-5">
          <article className="border border-mainBorderLight py-3 px-5 rounded-lg basis-full lg:basis-[48%] xl:basis-[32%] grow">
            <RecentCustomers
              t={t}
              data={mostRecentCustomers?.data}
              isLoading={isFetchingMostRecentCustomers}
            />
          </article>

          <article className="border border-mainBorderLight py-3 px-5 rounded-lg basis-full lg:basis-[48%] xl:basis-[25%] grow">
            <CustomersPieChart
              t={t}
              data={customersByType?.data}
              isLoading={isFetchingCustomersByType}
            />
          </article>

          <article className="border border-mainBorderLight py-3 px-5 rounded-lg basis-full  xl:basis-[50%] grow">
            <CustomersBarChart
              t={t}
              data={topCustomers?.data}
              isLoading={isFetchingTopCustomers}
            />
          </article>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
