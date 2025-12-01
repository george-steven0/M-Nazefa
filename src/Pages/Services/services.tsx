import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Button } from "antd";
import ServiceCard from "./Components/serviceCard";

const Services = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
        {[...Array(12)]?.map((_, index) => (
          <ServiceCard key={index} id={index} />
        ))}
      </section>
    </main>
  );
};

export default Services;
