import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Image, Skeleton, Tag } from "antd";
import { useTranslation } from "react-i18next";
import {
  useGetPackageByIdQuery,
  useTogglePackageMutation,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "../../../components/APIs/store";
import def from "../../../assets/imgs/logo-cropped.svg";
import { RiMoneyPoundCircleLine } from "react-icons/ri";
import { IoSpeedometerOutline } from "react-icons/io5";
import type { APIErrorProps } from "../../../components/Utilities/Types/types";
import { toast } from "react-toastify";

const ViewPackage = () => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state.lang);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [togglePackage, { isLoading: isDeactivateLoading }] =
    useTogglePackageMutation();

  const {
    data: packageById,
    isLoading,
    isFetching,
  } = useGetPackageByIdQuery(id ? { id } : skipToken);
  // console.log(packageById?.data);

  const navigate = useNavigate();

  const handleTogglePackage = async (status: boolean) => {
    const data = {
      packageId: id ? id : "",
      isActive: status,
    };

    try {
      await togglePackage(data).unwrap();
      toast.success("Package status updated successfully");
    } catch (error) {
      const err = error as APIErrorProps;
      console.error(err);
      toast.error(`Failed to set package status`);
    }
  };

  const handleNavigateButton = () => {
    const handleNavigate = () => {
      navigate(`/packages/edit-package?id=${id}`);
    };
    return (
      <div className="flex flex-col gap-1">
        <Button
          onClick={handleNavigate}
          className="bg-mainColor text-white py-5 min-w-[160px] capitalize"
        >
          {t("EDIT_PACKAGE")}
        </Button>
        <Button
          loading={isDeactivateLoading}
          onClick={() => handleTogglePackage(!packageById?.data?.isActive)}
          className={`flex items-center gap-2 font-medium transition-colors duration-500 ${packageById?.data?.isActive ? "bg-mainRed/70 hover:bg-mainRed" : "bg-green-700/70 hover:bg-green-700"} border-none text-white py-5 min-w-[160px] capitalize`}
        >
          {packageById?.data?.isActive ? (
            <span>{t("DEACTIVATE")}</span>
          ) : (
            <span>{t("ACTIVATE")}</span>
          )}
        </Button>
      </div>
    );
  };

  const handleDownload = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const imageUrl = packageById?.data?.termsAndConditions as unknown as string;

    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Terms_and_Conditions.jpg"; // Set your filename here
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: Just open in new tab if fetch fails
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="view-package-wrapper">
      {isLoading || isFetching ? (
        <Skeleton active paragraph={{ rows: 15 }} />
      ) : (
        <>
          <header className="view-package-title flex justify-center relative">
            <div>
              <Image
                className="w-[200px] h-[200px] object-cover rounded-lg"
                src={packageById?.data?.logo || def}
                alt="package logo"
              />
            </div>

            <div className="absolute top-0 right-0">
              {handleNavigateButton()}
            </div>
          </header>

          <section className="package-details-wrapper mt-6">
            <h1 className="flex items-center justify-center gap-1 text-2xl lg:text-4xl font-semibold text-center text-mainColor capitalize">
              <span>
                {lang === "ar"
                  ? packageById?.data?.arTitle
                  : packageById?.data?.title}
              </span>

              <span>
                <Tag
                  className={`capitalize rounded-full flex items-center px-3 ${packageById?.data?.isActive ? "bg-green-500/20 text-green-700 border-green-500" : "bg-red-500/20 text-red-700 border-red-500"}`}
                >
                  {packageById?.data?.isActive ? t("ACTIVE") : t("INACTIVE")}
                </Tag>
              </span>
            </h1>

            <hr className="my-6 text-gray-200" />

            <section className="mt-12 flex items-stretch justify-center gap-5">
              <div className="pr-5 border-r border-gray-200">
                <div className="flex flex-col items-center justify-center border border-mainColor/70 rounded-full size-35">
                  <span>
                    <IoSpeedometerOutline size={55} />
                  </span>

                  <p className="flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold">
                      {packageById?.data?.workingHours}
                    </span>
                    <span className="text-xs capitalize block w-fit wrap-break-word">
                      {t("WORKING_HOURS")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pr-5 border-r border-gray-200">
                <label className="text-lg font-semibold capitalize">
                  {t("WHAT_HAVE")}
                </label>
                {packageById?.data?.whatYouWillHaveOnIt}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold capitalize">
                  {t("WHAT_NOT_HAVE")}
                </label>
                {packageById?.data?.whatYouwouldntHaveOnIt}
              </div>
            </section>

            <hr className="my-6 text-gray-200" />

            <section className="mt-4 text-center text-[#555]">
              <p>{packageById?.data?.description || t("NA")}</p>
            </section>

            <section className="mt-6 gap-8">
              <label className="text-lg font-semibold capitalize">
                {t("PACKAGE_DETAILS")}:
              </label>
              <div className="flex items-start gap-8 mt-6 overflow-hidden overflow-x-auto">
                {packageById?.data?.packageDetails?.map((packageDetail) => (
                  <div
                    key={packageDetail.id}
                    className="flex items-center justify-between gap-2 min-h-[130px] min-w-[220px]  p-3 rounded-md text-gray-100 bg-linear-to-br from-mainColor/80 to-mainColor/60"
                  >
                    <div className="flex flex-col gap-2">
                      <p>
                        {packageDetail.numberOfRooms} {t("ROOMS")}
                      </p>
                      <p>
                        {packageDetail.numberOfWorkers} {t("WORKERS")}
                      </p>
                    </div>

                    <p className="flex items-center gap-1">
                      <span>
                        <RiMoneyPoundCircleLine />
                      </span>
                      {/* <span>{t("PRICE")}:</span> */}
                      {packageDetail.price} L.E
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="my-6 text-gray-200" />

            <section>
              <label className="text-lg font-semibold capitalize">
                {t("TRANSPORTATION_FEES")}:
              </label>

              <div className="flex items-start gap-8 mt-6 overflow-hidden overflow-x-auto">
                {packageById?.data?.transportationFees?.map(
                  (transportationFee) => (
                    <div
                      key={transportationFee.id}
                      className="flex items-center justify-between gap-2 min-h-[130px] min-w-[220px]  p-3 rounded-md text-mainColor/80 bg-gray-100 border border-mainColor/20 capitalize "
                    >
                      <div className="flex flex-col gap-2 [&>p]:flex [&>p]:items-center [&>p]:gap-1">
                        <p>
                          <span>{t("CITY")}:</span> {transportationFee.cityId}
                        </p>
                        <p>
                          <span>{t("FEES")}:</span> {transportationFee.fee}{" "}
                          <span>
                            <RiMoneyPoundCircleLine />
                          </span>
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            <hr className="my-6 text-gray-200" />

            <section>
              <label className="text-lg font-semibold capitalize">
                {t("RULES")}:
              </label>

              <p>{packageById?.data?.rules || t("NA")}</p>
            </section>

            <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 [&>div]:flex [&>div]:items-center [&>div]:gap-2 [&>div>label]:font-semibold capitalize">
              <div>
                <label>{t("TOOLS")}:</label>
                <p>{packageById?.data?.tools || t("NA")}</p>
              </div>

              <div>
                <label>{t("SUPPLIES")}:</label>
                <p>{packageById?.data?.supplies || t("NA")}</p>
              </div>
            </section>

            <hr className="my-6 text-gray-200" />

            <section className="w-full flex items-center justify-center">
              {packageById?.data?.termsAndConditions ? (
                <a
                  href={
                    (packageById?.data
                      ?.termsAndConditions as unknown as string) || "#"
                  }
                  target="_blank"
                  // download={"terms & conditions"}
                  className="border text-mainColor/90 border-mainColor/30 p-2 rounded-md cursor-pointer"
                  rel="noopener noreferrer"
                  onClick={handleDownload}
                >
                  <p className="text-lg font-semibold capitalize">
                    {t("TERMS")}
                  </p>
                </a>
              ) : (
                <p className="text-lg font-semibold capitalize">
                  {t("FILE_NOTFOUND")}
                </p>
              )}
            </section>
          </section>
        </>
      )}
    </div>
  );
};

export default ViewPackage;
