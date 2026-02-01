import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Button, Skeleton } from "antd";
import ServiceCard from "./Components/serviceCard";
import { useGetAllServicesQuery } from "../../components/APIs/Services/SERVICES_QUERY";

const Services = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data: services, isLoading, isFetching } = useGetAllServicesQuery();

  // console.log(services?.data);

  const handleNavigateAdd = () => {
    navigate("add-service");
  };

  const isChildPage =
    pathname.includes("add-service") ||
    pathname.includes("view-service") ||
    pathname.includes("edit-service");

  if (isChildPage) {
    return <Outlet />;
  }

  const handleTitleComponent = () => {
    return (
      <div className="flex items-center justify-between">
        <Button
          onClick={handleNavigateAdd}
          className="bg-mainColor text-white py-5 min-w-[150px] capitalize"
        >
          {t("ADD_SERVICE")}
        </Button>
      </div>
    );
  };

  return (
    <main>
      <header>
        <Title title={t("SERVICES")} component={handleTitleComponent} />
      </header>

      <section className="services-card-wrapper max-h-[70vh] overflow-y-auto mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading || isFetching
          ? [...Array(12)]?.map((_, index) => (
              <Skeleton key={index} active className="w-full h-full" />
            ))
          : services?.data?.map((service) => (
              <ServiceCard key={service?.id} id={service?.id || ""} />
            ))}
      </section>
    </main>
  );
};

export default Services;
