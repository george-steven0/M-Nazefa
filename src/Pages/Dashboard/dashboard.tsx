import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import HeaderCards from "./Components/HeaderCards/headerCards";
import MostPackages from "./Components/Charts/mostPackages";
import PackageChart from "./Components/Charts/packageChart";
import RecentCustomers from "./Components/RecentBlocks/recentCustomers";
import CustomersPieChart from "./Components/RecentBlocks/recentCustomersPieChart";
import CustomersBarChart from "./Components/RecentBlocks/recentCustomersBarChart";
import {
  useGetMonthlyTotalReservationQuery,
  useGetMostRecentCustomersQuery,
  useGetMostUsedPackagesQuery,
  useGetTodayTotalReservationQuery,
  useGetTotalCustomersQuery,
} from "../../components/APIs/Dashboard/DASHBOARD_QUERY";
import { Skeleton } from "antd";

const Dashboard = () => {
  const { t } = useTranslation();

  const { data: totalCustomers, isLoading: isLoadingTotalCustomers } =
    useGetTotalCustomersQuery();

  const { data: mostRecentCustomers, isLoading: isLoadingMostRecentCustomers } =
    useGetMostRecentCustomersQuery();

  const {
    data: todayTotalReservation,
    isLoading: isLoadingTodayTotalReservation,
  } = useGetTodayTotalReservationQuery();

  const {
    data: monthlyTotalReservation,
    isLoading: isLoadingMonthlyTotalReservation,
  } = useGetMonthlyTotalReservationQuery();

  const { data: mostUsedPackages, isLoading: isLoadingMostUsedPackages } =
    useGetMostUsedPackagesQuery();

  // console.log(totalCustomers?.data);

  const tabsList = [
    {
      id: 1,
      label: t("CURRENT_TOTAL_RESERVATION"),
      value: todayTotalReservation?.data || 0,
      // perecent: "22",
      // type: "up",
      currency: false,
    },
    {
      id: 2,
      label: t("MONTHLY_TOTAL_RESERVATION"),
      value: monthlyTotalReservation?.data || 0,
      // perecent: "43",
      // type: "down",
      currency: true,
    },
    {
      id: 3,
      label: t("OUR_CLIENTS"),
      value: totalCustomers?.data || 0,
      // perecent: "10",
      // type: "up",
      currency: false,
    },
  ];
  return (
    <main>
      <header>
        <Title title={t("DASHBOARD")} />
      </header>

      <div className="main-content-wrapper mt-8 flex flex-col gap-10">
        <section className="tabs-container grid grid-cols-1 lg:grid-cols-3 gap-5">
          {isLoadingTodayTotalReservation ||
          isLoadingMonthlyTotalReservation ||
          isLoadingTotalCustomers ? (
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
              isLoading={isLoadingMostUsedPackages}
            />
          </div>

          <div className="packages-line-chart-wrapper basis-full lg:basis-[68%] h-full grow">
            <PackageChart t={t} />
          </div>
        </section>

        <section className="recent-wrappers flex flex-col lg:flex-row flex-wrap xl:flex-nowrap items-stretch gap-5">
          <article className="border border-mainBorderLight py-3 px-5 rounded-lg basis-full lg:basis-[48%] xl:basis-[32%] grow">
            <RecentCustomers
              t={t}
              data={mostRecentCustomers?.data}
              isLoading={isLoadingMostRecentCustomers}
            />
          </article>

          <article className="border border-mainBorderLight py-3 px-5 rounded-lg basis-full lg:basis-[48%] xl:basis-[25%] grow">
            <CustomersPieChart t={t} />
          </article>

          <article className="border border-mainBorderLight py-3 px-5 rounded-lg basis-full  xl:basis-[50%] grow">
            <CustomersBarChart t={t} />
          </article>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
