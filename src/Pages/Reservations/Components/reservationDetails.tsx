import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import {
  Button,
  Skeleton,
  Card,
  Descriptions,
  Tag,
  Divider,
  Typography,
  Avatar,
  List,
} from "antd";
import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaDownload } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import {
  useAssignWorkerToReservationMutation,
  useGetReservationByIdQuery,
} from "../../../components/APIs/Reservations/RESERVATION_QUERY";
import { skipToken } from "@reduxjs/toolkit/query";
import dayjs from "dayjs";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReservationDetailsPdf } from "./reservationDetailsPdf";
import AssignWorkerModal from "./assignWorkerModal";
import { useAppSelector } from "../../../components/APIs/store";
import { useForm } from "react-hook-form";
import type {
  APIErrorProps,
  assignWorkerFormProps,
} from "../../../components/Utilities/Types/types";
import { toast } from "react-toastify";

const { Text, Title: TypographyTitle } = Typography;

const ReservationDetails = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const id = params.get("id");
  const { lang } = useAppSelector((state) => state?.lang);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<assignWorkerFormProps>({
    defaultValues: {
      workers: [],
    },
  });

  const {
    data: reservationData,
    isLoading,
    isFetching,
  } = useGetReservationByIdQuery(id ? { id } : skipToken);

  const [assignWorker, { isLoading: assignWorkerLoading }] =
    useAssignWorkerToReservationMutation();

  const reservation = reservationData?.data;

  const renderValue = (value: boolean | string | null | undefined) => {
    if (value === null || value === undefined || value === "") {
      return <Text type="secondary">{t("N/A") || "N/A"}</Text>;
    }
    if (typeof value === "boolean") {
      return value ? (
        <Tag color="success" icon={<FaCheckCircle className="inline mr-1" />}>
          {t("YES") || "Yes"}
        </Tag>
      ) : (
        <Tag color="error" icon={<FaTimesCircle className="inline mr-1" />}>
          {t("NO") || "No"}
        </Tag>
      );
    }
    return <Text className="font-medium">{value}</Text>;
  };

  // Assign worker modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleAssignWorker = async (data: assignWorkerFormProps) => {
    const payload = {
      reservationId: id || "",
      workerIds: data.workers?.map((w) => w.workerId as string),
    };

    try {
      await assignWorker(payload).unwrap();
      toast.success(t("WORKERS_UPDATED_SUCCESSFULLY"));
      toggleModal();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };

  // console.log(reservationData?.data?.reservationWorkers);

  if (isLoading || isFetching) {
    return (
      <main className="p-4">
        <header>
          <Skeleton.Button active style={{ width: 300, height: 40 }} />
        </header>
        <Skeleton className="mt-8" active paragraph={{ rows: 15 }} />
      </main>
    );
  }

  return (
    <>
      <main className="pb-10 bg-lightGray min-h-screen capitalize  rounded-lg">
        <header className="bg-white p-6 shadow-sm mb-6 rounded-b-2xl">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <Title
              title={t("CUSTOMER_RESERVATION_DETAILS")}
              subTitle
              component={null}
              className="m-0"
            />
            <div className="flex gap-3">
              {reservation && (
                <div className="flex items-center gap-3">
                  <PDFDownloadLink
                    document={<ReservationDetailsPdf data={reservation} />}
                    fileName={`reservation-${reservation.id}.pdf`}
                  >
                    {({ loading }: { loading: boolean }) => (
                      <Button
                        type="primary"
                        icon={<FaDownload />}
                        loading={loading}
                        className="bg-mainColor hover:bg-mainColor/90! border-none px-4 py-3 h-auto rounded-md flex items-center justify-center font-semibold"
                      >
                        {loading ? "Loading..." : t("DOWNLOAD_PDF")}
                      </Button>
                    )}
                  </PDFDownloadLink>

                  <Button
                    type="primary"
                    className="bg-white text-mainColor hover:bg-mainColor/90! hover:text-white border-mainColor border-2 px-4 py-3 h-auto rounded-md flex items-center justify-center font-semibold"
                    onClick={toggleModal}
                  >
                    {t("ASSIGN_WORKERS")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="px-4 lg:px-8 flex flex-col gap-6">
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
              title={
                <span className="flex items-center gap-2 text-mainColor">
                  <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                  {t("CUSTOMER_INFO")}
                </span>
              }
            >
              <Descriptions column={1} size="small" colon={false}>
                <Descriptions.Item label={t("FULL_NAME")}>
                  {renderValue(reservation?.customerName)}
                </Descriptions.Item>
                <Descriptions.Item label={t("ID_NUMBER")}>
                  {renderValue(reservation?.customerNationalId)}
                </Descriptions.Item>
                <Descriptions.Item label={t("PHONE_NUMBER")}>
                  {renderValue(
                    reservation?.customerPhoneNumbers
                      ?.map((phone) => phone.phoneNumber)
                      .join(", "),
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
              title={
                <span className="flex items-center gap-2 text-mainColor">
                  <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                  {t("APPOINTMENT")}
                </span>
              }
            >
              <Descriptions column={1} size="small" colon={false}>
                <Descriptions.Item label={t("DATE")}>
                  {renderValue(
                    reservation?.reservationDate
                      ? dayjs(reservation.reservationDate).format("DD/MM/YYYY")
                      : null,
                  )}
                </Descriptions.Item>
                <Descriptions.Item label={t("TIME")}>
                  {renderValue(
                    reservation?.reservationDate
                      ? dayjs(reservation.reservationDate).format("hh:mm A")
                      : null,
                  )}
                </Descriptions.Item>
                {/* <Descriptions.Item label={t("AMOUNT")}>
                  <div className="text-mainOrange font-bold text-lg">
                    {reservation?.reservationAmount ?? 0} L.E
                  </div>
                </Descriptions.Item> */}
              </Descriptions>
            </Card>

            <Card
              className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
              title={
                <span className="flex items-center gap-2 text-mainColor">
                  <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                  {t("ADDRESS")}
                </span>
              }
            >
              <Descriptions column={1} size="small" colon={false}>
                <Descriptions.Item label={t("AREA")}>
                  {renderValue(reservation?.customerAddressName)}
                </Descriptions.Item>
                <Descriptions.Item label={t("CITY")}>
                  {renderValue(reservation?.city)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Building Details */}
          <Card
            className="rounded-2xl border-none shadow-sm"
            title={
              <span className="flex items-center gap-2 text-mainColor">
                <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                {t("BUILDING_DETAILS")}
              </span>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("INSECTS")}
                </Text>
                {renderValue(reservation?.insects)}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("RODENTS")}
                </Text>
                {renderValue(reservation?.rodents)}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("APARTMENT_CLOSING_PERIOD")}
                </Text>
                {renderValue(reservation?.apartmentClosingPeriod)}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("GENERAL_COMMENTS")}
                </Text>
                {renderValue(reservation?.generalComments)}
              </div>
            </div>
          </Card>

          <Card
            className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
            title={
              <span className="flex items-center gap-2 text-mainColor">
                <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                {t("WORKERS")}
              </span>
            }
          >
            <div className="flex items-center justify-between gap-5">
              {reservation?.reservationWorkers?.map((worker) => (
                <div key={worker.workerId} className="flex gap-2">
                  <span className="w-[3px] h-6 bg-mainOrange rounded-full" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{t("WORKER")} : </span>
                    <span>
                      {lang === "ar" ? worker.workerArName : worker.workerName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Packages */}
          <div className="mt-4">
            <TypographyTitle
              level={4}
              className="text-mainColor flex items-center gap-2 mb-6"
            >
              <span className="w-2 h-8 bg-mainColor rounded-full" />
              {t("PACKAGE_DETAILS")}
            </TypographyTitle>

            <div className="flex flex-col gap-6">
              {reservation?.getPackageDtoList?.map((pkg, index: number) => (
                <Card
                  key={index}
                  className="rounded-2xl border-none shadow-sm overflow-hidden"
                  styles={{ body: { padding: 0 } }}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Package Left Side - Visual */}
                    <div className="lg:w-1/4 bg-mainColor p-8 flex flex-col items-center justify-center text-white text-center">
                      <Avatar
                        size={80}
                        src={pkg.getPackageDto?.logo}
                        className="bg-white mb-4 border-4 border-mainOrange"
                      />
                      <TypographyTitle level={5} className="text-white! m-0!">
                        {lang
                          ? pkg.getPackageDto?.arTitle
                          : pkg.getPackageDto?.title}
                      </TypographyTitle>
                      {/* <Tag
                        color="orange"
                        className="mt-2 rounded-full border-none px-3"
                      >
                        {pkg.count} {t("ITEM(S)") || "Items"}
                      </Tag> */}
                    </div>

                    {/* Package Right Side - Details */}
                    <div className="lg:w-3/4 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Text type="secondary" className="text-xs block mb-1">
                            {t("SUB_TITLE")}
                          </Text>
                          <Text className="font-semibold">
                            {lang
                              ? pkg.getPackageDto?.arSubTitle
                              : pkg.getPackageDto?.subTitle}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary" className="text-xs block mb-1">
                            {t("NO_WORKERS")}
                          </Text>
                          <Text className="font-semibold">
                            {pkg.getPackageDto?.numberOfWorkers}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary" className="text-xs block mb-1">
                            {t("NUMBER_OF_ROOMS")}
                          </Text>
                          <Text className="font-semibold">
                            {pkg.getPackageDto?.numberOfRooms}
                          </Text>
                        </div>
                      </div>

                      <Divider className="my-4" />

                      <div className="mb-4">
                        <Text
                          type="secondary"
                          className="text-xs block mb-2 font-bold uppercase tracking-wider"
                        >
                          {t("DESCRIPTION")}
                        </Text>
                        <Text className="text-mainTextLight">
                          {pkg.getPackageDto?.description}
                        </Text>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <Text
                            type="secondary"
                            className="text-xs block mb-2 font-bold uppercase tracking-wider"
                          >
                            {t("EXTRA_SERVICES")}
                          </Text>
                          {pkg?.reservationPackageExtraServices?.length > 0 ? (
                            <List
                              size="small"
                              dataSource={pkg?.reservationPackageExtraServices}
                              className="[&_.ant-list-items]:grid [&_.ant-list-items]:grid-cols-2 [&_.ant-list-items]:gap-5"
                              renderItem={(item) => (
                                <List.Item className="py-1! px-0! border-none">
                                  <Tag className="flex items-center gap-2 bg-mainOrange/20 text-mainOrange border-mainOrange">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-mainOrange" />
                                      {item.service}
                                    </div>
                                    <Text className="font-semibold text-mainOrange">
                                      {item.price} L.E
                                    </Text>
                                  </Tag>
                                </List.Item>
                              )}
                            />
                          ) : (
                            renderValue(null)
                          )}
                        </div>
                        <div className="flex flex-col justify-end items-end">
                          <div className="bg-lightGray rounded-xl p-4 w-full md:w-auto min-w-[180px]">
                            <Text
                              type="secondary"
                              className="text-xs block mb-1"
                            >
                              {t("PACKAGE_AMOUNT")}
                            </Text>
                            <div className="text-xl font-bold text-mainColor">
                              {pkg.packageAmount} L.E
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8">
              <TypographyTitle
                level={4}
                className="text-mainColor flex items-center gap-2 mb-6"
              >
                <span className="w-2 h-8 bg-mainColor rounded-full" />
                {t("RESERVATION_SUMMARY")}
              </TypographyTitle>

              <div className="rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden bg-white">
                <div className="bg-mainColor px-5 py-3">
                  <h3 className="text-white font-semibold text-lg capitalize m-0">
                    {t("RESERVATION_SUMMARY")}
                  </h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {(() => {
                    let grandTotal = 0;

                    const packageRows = reservation?.getPackageDtoList?.map(
                      (pkg: Record<string, unknown>, index: number) => {
                        const packageDto = (pkg.getPackageDto || {}) as Record<
                          string,
                          unknown
                        >;
                        const extraServices =
                          (pkg.reservationPackageExtraServices || []) as Record<
                            string,
                            unknown
                          >[];

                        const count = Number(pkg.count) || 1;

                        // Use pkg.packageAmount as the base price. Fallback to packageDto.price if needed.
                        const basePrice =
                          Number(pkg.packageAmount ?? packageDto.price) || 0;
                        const discount = Number(packageDto.discount) || 0;

                        const rawIsPercentage =
                          packageDto.isPercentage ?? packageDto.IsPercentage;
                        const isPercentage =
                          rawIsPercentage === true ||
                          rawIsPercentage === "true";

                        let discountAmount = 0;

                        if (discount > 0) {
                          if (isPercentage) {
                            discountAmount = (basePrice * discount) / 100;
                          } else {
                            discountAmount = discount;
                          }
                        }
                        const priceAfterDiscount = Math.max(
                          0,
                          basePrice - discountAmount,
                        );

                        const extraServicesTotal = extraServices.reduce(
                          (sum: number, es: Record<string, unknown>) =>
                            sum + (Number(es.price) || 0),
                          0,
                        );

                        // Multiply by count if the package has quantity
                        const calculatedTotal =
                          (priceAfterDiscount + extraServicesTotal) * count;

                        grandTotal += calculatedTotal;

                        return (
                          <div
                            key={index}
                            className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#1D1B1B] capitalize">
                                {lang
                                  ? (packageDto.arTitle as string)
                                  : (packageDto.title as string)}
                              </span>
                              <span className="text-gray-700 font-medium">
                                {basePrice > 0
                                  ? `${basePrice.toLocaleString()} ${t("EGP")}`
                                  : renderValue(null)}
                              </span>
                            </div>

                            {discount > 0 && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                  {t("DISCOUNT")}{" "}
                                  <Tag color="volcano" className="ms-1">
                                    {isPercentage
                                      ? `${discount}%`
                                      : `${discount} ${t("EGP")}`}
                                  </Tag>
                                </span>
                                <span className="text-red-500">
                                  - {discountAmount.toLocaleString()} {t("EGP")}
                                </span>
                              </div>
                            )}

                            {discount > 0 && (
                              <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-gray-600">
                                  {t("PRICE_AFTER_DISCOUNT")}
                                </span>
                                <span className="text-green-700">
                                  {priceAfterDiscount.toLocaleString()}{" "}
                                  {t("EGP")}
                                </span>
                              </div>
                            )}

                            {extraServices.length > 0 && (
                              <div className="flex flex-col gap-1 mt-1">
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                  {t("EXTRA_SERVICE_DETAILS")}
                                </span>
                                {extraServices.map(
                                  (
                                    es: Record<string, unknown>,
                                    esIdx: number,
                                  ) => (
                                    <div
                                      key={esIdx}
                                      className="flex items-center justify-between text-sm ps-2"
                                    >
                                      <span className="text-gray-600 capitalize">
                                        {es.service as string}
                                      </span>
                                      <span className="text-gray-700">
                                        + {Number(es.price).toLocaleString()}{" "}
                                        {t("EGP")}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}

                            {count > 1 && (
                              <div className="flex items-center justify-between text-sm font-medium mt-1">
                                <span className="text-gray-600">
                                  {t("QUANTITY")}
                                </span>
                                <span className="text-gray-700">x {count}</span>
                              </div>
                            )}

                            <Divider className="my-1" />
                            <div className="flex items-center justify-between font-semibold text-[#1D1B1B]">
                              <span>{t("SUBTOTAL")}</span>
                              <span>
                                {Number(calculatedTotal).toLocaleString()}{" "}
                                {t("EGP")}
                              </span>
                            </div>
                          </div>
                        );
                      },
                    );

                    return (
                      <>
                        {packageRows}
                        <div className="flex items-center justify-between bg-mainColor/10 rounded-lg px-4 py-3 mt-1">
                          <span className="font-bold text-mainColor text-lg capitalize">
                            {t("TOTAL_AMOUNT")}
                          </span>
                          <span className="font-bold text-mainColor text-xl">
                            {Number(grandTotal).toLocaleString()} {t("EGP")}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AssignWorkerModal
        open={isModalOpen}
        close={toggleModal}
        onConfirm={handleAssignWorker}
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        setValue={setValue}
        reset={reset}
        workers={reservation?.reservationWorkers}
        loading={assignWorkerLoading}
      />
    </>
  );
};

export default ReservationDetails;
