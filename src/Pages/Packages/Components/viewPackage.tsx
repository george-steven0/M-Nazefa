import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Image, Skeleton, Spin, Tag } from "antd";
import { useTranslation } from "react-i18next";
import {
  useGetPackageByIdQuery,
  useTogglePackageMutation,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "../../../components/APIs/store";
import def from "../../../assets/imgs/logo-cropped.svg";
import type { APIErrorProps } from "../../../components/Utilities/Types/types";
import { toast } from "react-toastify";
import { FaPoundSign } from "react-icons/fa";
import { LuPackageOpen } from "react-icons/lu";
import { MdOutlineAddHome, MdOutlineDiscount } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { useState } from "react";

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

  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsDownloading(true);
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
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="view-package-wrapper">
      {isLoading || isFetching ? (
        <Skeleton active paragraph={{ rows: 15 }} />
      ) : (
        <>
          <header className="view-package-title flex items-stretch gap-4 relative">
            <div>
              <Image
                className="w-[200px] h-[200px] object-cover rounded-lg"
                src={packageById?.data?.logo || def}
                alt="package logo"
              />
            </div>

            <div className="flex flex-col justify-between items-start">
              <h1 className="flex items-start gap-3 font-semibold text-center text-mainColor capitalize">
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-2xl lg:text-4xl">
                    {lang === "ar"
                      ? packageById?.data?.arTitle
                      : packageById?.data?.title}
                  </span>

                  <span className="text-sm text-gray-400">
                    {lang === "ar"
                      ? packageById?.data?.subTitlearSubTitle
                      : packageById?.data?.subTitle}
                  </span>
                </div>

                <span>
                  <Tag
                    className={`mt-2 capitalize rounded-full flex items-center px-3 ${packageById?.data?.isActive ? "bg-green-500/20 text-green-700 border-green-500" : "bg-red-500/20 text-red-700 border-red-500"}`}
                  >
                    {packageById?.data?.isActive ? t("ACTIVE") : t("INACTIVE")}
                  </Tag>
                </span>
              </h1>
            </div>

            <div className="absolute top-0 right-0">
              {handleNavigateButton()}
            </div>
          </header>

          <section className="mt-2 text-left text-[#555]">
            <p>{packageById?.data?.description || t("NA")}</p>
          </section>

          <hr className="my-10 text-gray-200" />

          <section className="package-details-wrapper md:max-w-[90%] mx-auto">
            <div className="flex items-center justify-between gap-5 [&>div]:grow [&>div]:text-center [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div]:items-center [&>div>p]:font-semibold [&>div>p]:text-xl capitalize">
              <div className="package-type-wrapper w-full bg-[#EDF2F5] text-mainColor py-3 rounded-md p-2">
                <label>{t("PACKAGE_TYPE")}:</label>
                <p className="flex items-center gap-2">
                  <span>
                    <LuPackageOpen size={25} />
                  </span>
                  <span className="text-base">
                    {lang === "ar"
                      ? packageById?.data?.packageTypeArName
                      : packageById?.data?.packageTypeName || t("NA")}
                  </span>
                </p>
              </div>

              <div className="rooms-wrapper w-full bg-green-600/40 text-mainColor p-2 rounded-md">
                <label>{t("ROOMS")}:</label>
                <p className="flex items-center gap-2">
                  <span>
                    <MdOutlineAddHome size={25} />
                  </span>
                  <span>{packageById?.data?.numberOfRooms || t("NA")}</span>
                </p>
              </div>

              <div className="workers-wrapper w-full bg-blue-500/40 text-mainColor p-2 rounded-md">
                <label>{t("WORKERS")}:</label>
                <p className="flex items-center gap-2">
                  <span>
                    <HiOutlineUserGroup size={25} />
                  </span>
                  <span>{packageById?.data?.numberOfWorkers || t("NA")}</span>
                </p>
              </div>

              <div className="discount-wrapper w-full bg-amber-400 text-white p-2 rounded-md">
                <label>{t("DISCOUNT")}:</label>
                <div className="flex items-center gap-1">
                  <span>
                    <MdOutlineDiscount />
                  </span>
                  <p className="flex items-center gap-1">
                    <span>{packageById?.data?.discount || 0}</span>
                    <span>{packageById?.data?.isPercentage ? "%" : "L.E"}</span>
                  </p>
                </div>
              </div>

              <div className="price-wrapper w-full bg-blue-500 text-white p-2 rounded-md">
                <label>{t("PRICE")}:</label>
                <p className="flex items-center gap-1">
                  <span>
                    <FaPoundSign />
                  </span>
                  <span>{packageById?.data?.price || t("NA")}</span>
                </p>
              </div>
            </div>
          </section>

          <hr className="my-10 text-gray-200" />

          <section className="cleaning-extra-wrapper">
            <div className="flex items-start justify-between gap-8 [&>article]:basis-full [&>article]:md:basis-1/2">
              <article className="max-w-1/2 overflow-x-auto ">
                <label className="text-lg font-semibold capitalize mb-2 block">
                  {t("CLEANING_AREA")}:
                </label>

                <div className="flex items-center gap-2">
                  {packageById?.data?.cleaningAreaDetails?.map((item) => (
                    <Tag
                      key={item?.id}
                      className="capitalize rounded-full flex items-center px-3 bg-green-500/20 text-green-700 border-green-500"
                    >
                      {lang === "ar" ? item?.arName : item?.name}
                    </Tag>
                  ))}
                </div>
              </article>

              <article>
                <label className="text-lg font-semibold capitalize mb-2 block">
                  {t("EXTRA_SERVICES")}:
                </label>

                <div className="flex items-center gap-2">
                  {packageById?.data?.extraServices?.map((item) => (
                    <Tag
                      key={item?.id}
                      className="capitalize rounded-full flex items-center gap-1 px-3 bg-blue-500/20 text-blue-700 border-blue-500"
                    >
                      <span>{lang === "ar" ? item?.arName : item?.name}:</span>
                      <span className="flex items-center">
                        {item?.price} <FaPoundSign />
                      </span>
                    </Tag>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <hr className="my-10 text-gray-200" />

          <section className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:gap-1 [&>div]:bg-gray-300/30 [&>div]:p-4 [&>div]:rounded-md [&>div>label]:block [&>div>label]:text-lg [&>div>label]:font-semibold capitalize">
            <div>
              <label>{t("RULES")}</label>

              <p>{packageById?.data?.rules || t("NA")}</p>
            </div>

            <div>
              <label>{t("TOOLS")}</label>
              <p>{packageById?.data?.tools || t("NA")}</p>
            </div>

            <div>
              <label>{t("SUPPLIES")}</label>
              <p>{packageById?.data?.supplies || t("NA")}</p>
            </div>
          </section>

          <hr className="my-10 text-gray-200" />

          <section className="w-full flex items-center justify-center min-w-20">
            {packageById?.data?.termsAndConditions ? (
              <a
                href={
                  (packageById?.data
                    ?.termsAndConditions as unknown as string) || "#"
                }
                target="_blank"
                // download={"terms & conditions"}
                className="block text-center border text-mainColor/90 border-mainColor/30 py-2 px-6 rounded-full hover:bg-mainColor/10 transition-all duration-500 cursor-pointer"
                rel="noopener noreferrer"
                onClick={handleDownload}
              >
                {isDownloading ? (
                  <span className="px-5">
                    <Spin />
                  </span>
                ) : (
                  <p className="text-lg font-semibold capitalize">
                    {t("TERMS")}
                  </p>
                )}
              </a>
            ) : (
              <p className="text-lg font-semibold capitalize">
                {t("FILE_NOTFOUND")}
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default ViewPackage;
