import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import PackageCard from "./Components/packageCard";

const Packages = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleAddButton = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={() => navigate("add-package")}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_PACKAGE")}
        </Button>
      </div>
    );
  };

  //   const { SearchBox } = useSearchBox({
  //     placeholder: "Search Clients",
  //   });

  //Render Outlet
  const isChildPage =
    pathname.includes("add-package") ||
    pathname.includes("view-package") ||
    pathname.includes("edit-package");

  if (isChildPage) {
    return <Outlet />;
  }

  return (
    <div className="packages-page-wrapper">
      <section className="packages-title-wrapper">
        <Title title={t("PACKAGES")} component={handleAddButton} />
      </section>

      <section className="packages-card-wrapper max-h-[70vh] overflow-y-auto mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(8)]?.map((_, index) => (
          <PackageCard key={index} id={index} />
        ))}
      </section>
    </div>
  );
};

export default Packages;
