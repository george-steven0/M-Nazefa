import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import HeaderCards from "./Components/HeaderCards/headerCards";
import MostPackages from "./Components/Charts/mostPackages";
import PackageChart from "./Components/Charts/packageChart";
import RecentCustomers from "./Components/RecentBlocks/recentCustomers";
import CustomersPieChart from "./Components/RecentBlocks/recentCustomersPieChart";
import CustomersBarChart from "./Components/RecentBlocks/recentCustomersBarChart";

const Dashboard = () => {
  const { t } = useTranslation();

  const tabsList = [
    {
      id: 1,
      label: t("CURRENT_TOTAL_RESERVATION"),
      value: "12426",
      perecent: "22",
      type: "up",
      currency: true,
    },
    {
      id: 2,
      label: t("MONTHLY_TOTAL_RESERVATION"),
      value: "248623",
      perecent: "43",
      type: "down",
      currency: true,
    },
    {
      id: 3,
      label: t("OUR_CLIENTS"),
      value: "25048",
      perecent: "10",
      type: "up",
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
          {tabsList?.map((data) => (
            <HeaderCards key={data?.id} data={data} />
          ))}
        </section>

        <section className="packages-chart-container flex flex-wrap lg:flex-nowrap items-start gap-5 lg:h-[300px]">
          <div className="most-sold-packages-wrapper basis-full lg:basis-[32%] h-full grow">
            <MostPackages t={t} />
          </div>

          <div className="packages-line-chart-wrapper basis-full lg:basis-[68%] h-full grow">
            <PackageChart t={t} />
          </div>
        </section>

        <section className="recent-wrappers flex flex-col lg:flex-row flex-wrap xl:flex-nowrap items-stretch gap-5">
          <article className="border border-mainBorderLight py-3 px-5 rounded-lg basis-full lg:basis-[48%] xl:basis-[32%] grow">
            <RecentCustomers t={t} />
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
