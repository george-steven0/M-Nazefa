import { useNavigate, useSearchParams } from "react-router-dom";
import Title from "../../../components/Common/Title/title";
import { Button, Empty, Skeleton, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { useGetServiceByIdQuery } from "../../../components/APIs/Services/SERVICES_QUERY";
import { skipToken } from "@reduxjs/toolkit/query";
import { LuPackageOpen } from "react-icons/lu";

const ViewService = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  //   console.log(id);

  const {
    data: service,
    isLoading,
    isFetching,
  } = useGetServiceByIdQuery(id ? { id } : skipToken);

  // console.log(service);

  const navigate = useNavigate();
  const handleNavigateButton = () => {
    const handleNavigate = () => {
      navigate(`/services/edit-service?id=${id}`);
    };
    return (
      <Button
        onClick={handleNavigate}
        className="bg-mainColor text-white py-5 min-w-[160px] capitalize"
      >
        {t("EDIT_SERVICE")}
      </Button>
    );
  };

  const serviceData = service?.data;
  const packages = serviceData?.packages ?? [];

  return (
    <div className="view-service-wrapper">
      {isLoading || isFetching ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <>
          <header className="view-service-title w-full flex items-center justify-between gap-3">
            <Title
              title={
                <div className="flex items-center gap-3">
                  <span>{(lang === "en" ? serviceData?.title : serviceData?.arTitle) || ""}</span>

            <Tag
              className={`capitalize rounded-full px-3 py-0.5 ${
                serviceData?.isActive
                  ? "bg-green-500/20 text-green-700 border-green-500"
                  : "bg-red-500/20 text-red-700 border-red-500"
              }`}
            >
              {serviceData?.isActive ? t("ACTIVE") : t("INACTIVE")}
            </Tag>
                </div>
                
              }
              subTitle
              component={handleNavigateButton}
            />

            
          </header>

          <section className="service-details-wrapper mt-6">
            <div>
              <label className="block mb-1 font-semibold text-lg text-mainColor capitalize">
                {t("DESCRIPTION")}
              </label>
              <p className="max-w-[80%] md:max-w-[60%] text-[#646363]">
                {serviceData?.description || t("NA")}
              </p>
            </div>

            <div className="mt-8">
              <label className="flex items-center gap-2 mb-3 font-semibold text-lg text-mainColor capitalize">
                {t("PACKAGES")}
                <span className="text-sm font-medium text-[#646363]">
                  ({packages.length})
                </span>
              </label>

              {packages.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.packageId}
                      className="flex items-center gap-2 border border-[#E5E5E5] bg-[#F8FAFB] rounded-lg px-4 py-2.5 text-[#1D1B1B]"
                    >
                      <LuPackageOpen className="text-mainColor" size={20} />
                      <span className="text-sm font-medium capitalize">
                        {lang === "en"
                          ? pkg.packageName
                          : pkg.packageArName || pkg.packageName}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description={t("NO_DATA_FOUND")} />
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ViewService;
