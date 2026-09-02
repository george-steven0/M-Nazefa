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
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useAssignWorkerToReservationMutation,
  useConfirmReservationMutation,
  useGetReservationByIdQuery,
} from "../../../components/APIs/Reservations/RESERVATION_QUERY";
import { useGetCustomerByIdQuery } from "../../../components/APIs/ClientQuery/CLIENTS_QUERY";
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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id");
  const { lang } = useAppSelector((state) => state?.lang);

  const [confirmReservation, { isLoading: isConfirmLoading }] =
    useConfirmReservationMutation();

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

  const {
    data: customer,
    isLoading: customerLoading,
    isFetching: customerIsFetching,
  } = useGetCustomerByIdQuery(
    reservation?.customerId
      ? { id: reservation.customerId.toString() }
      : skipToken,
  );

  const customerData = customer?.data;
  const selectedAddress = customerData?.address?.find(
    (a) => a.id === reservation?.customerAddressId,
  );

  // console.log(selectedAddress);

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

  if (isLoading || isFetching || customerLoading || customerIsFetching) {
    return (
      <main className="p-4">
        <header>
          <Skeleton.Button active style={{ width: 300, height: 40 }} />
        </header>
        <Skeleton className="mt-8" active paragraph={{ rows: 15 }} />
      </main>
    );
  }

  const handleConfirmReservation = async () => {
    try {
      await confirmReservation({ reservationId: Number(id) }).unwrap();
      toast.success(t("RESERVATION_CONFIRMED_SUCCESSFULLY"));
      reset();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };

  const handleNavigateToPayments = () => {
    navigate(`/reservations/reservation-payemnts?id=${id}`);
  };

  // console.log(customer?.data);

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 bg-lightGray min-h-screen capitalize rounded-lg">
        <header className="bg-white p-4 sm:p-6 shadow-sm mb-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Title
              title={t("CUSTOMER_RESERVATION_DETAILS")}
              subTitle
              component={null}
              className="m-0 [&>span]:text-lg sm:[&>span]:text-xl"
            />
            {reservation && (
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3 [&>button]:text-xs [&>button]:px-2.5 sm:[&>button]:text-sm sm:[&>button]:px-4">
                <Button
                  onClick={handleNavigateToPayments}
                  className="bg-mainOrange text-white font-semibold capitalize"
                >
                  {t("VIEW_PAYEMNTS")}
                </Button>

                <PDFDownloadLink
                  document={
                    <ReservationDetailsPdf
                      data={reservation}
                      customer={customerData}
                      address={selectedAddress}
                    />
                  }
                  fileName={`reservation-${reservation.id}.pdf`}
                >
                  {({ loading }: { loading: boolean }) => (
                    <Button
                      type="primary"
                      icon={<FaDownload />}
                      loading={loading}
                      className="bg-mainColor hover:bg-mainColor/90! border-none rounded-md font-semibold"
                    >
                      {loading ? t("LOADING") : t("DOWNLOAD_PDF")}
                    </Button>
                  )}
                </PDFDownloadLink>

                <Button
                  type="primary"
                  className="bg-white text-mainColor hover:bg-mainColor/90! hover:text-white border-mainColor border-2 rounded-md font-semibold"
                  onClick={toggleModal}
                >
                  {t("ASSIGN_WORKERS")}
                </Button>

                {reservation?.onSpot && !reservation?.isConfirmed && (
                  <Button
                    loading={isConfirmLoading}
                    onClick={handleConfirmReservation}
                    className="capitalize font-semibold border border-green-600 text-green-600 bg-green-600/20 hover:bg-green-600/40"
                  >
                    {t("CONFIRM_RESERVATION")}
                  </Button>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="flex flex-col gap-6">
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
              title={
                <span className="flex items-center gap-2 text-mainColor">
                  <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                  {t("APPOINTMENT")}
                </span>
              }
            >
              <Descriptions
                column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                size="small"
                colon={false}
              >
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
              </Descriptions>
            </Card>

            <Card
              className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
              title={
                <span className="flex items-center gap-2 text-mainColor">
                  <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                  {t("APARTMENT")}
                </span>
              }
            >
              <Descriptions
                column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                size="small"
                colon={false}
              >
                <Descriptions.Item label={t("INSECTS")}>
                  {renderValue(reservation?.insects)}
                </Descriptions.Item>
                <Descriptions.Item label={t("RODENTS")}>
                  {renderValue(reservation?.rodents)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={t("APARTMENT_CLOSING_PERIOD")}
                  span={2}
                >
                  {renderValue(reservation?.apartmentClosingPeriod)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Customer Info */}
          <Card
            className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
            title={
              <span className="flex items-center gap-2 text-mainColor">
                <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                {t("CUSTOMER_INFO")}
              </span>
            }
          >
            <Descriptions
              column={{ xs: 1, sm: 2, lg: 3 }}
              size="small"
              colon={false}
            >
              <Descriptions.Item label={t("FIRST_NAME")}>
                {renderValue(
                  customerData?.firstName ||
                    reservation?.customerName?.split(" ")[0],
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t("MIDDLE_NAME")}>
                {renderValue(customerData?.middleName)}
              </Descriptions.Item>
              <Descriptions.Item label={t("LAST_NAME")}>
                {renderValue(customerData?.lastName)}
              </Descriptions.Item>
              <Descriptions.Item label={t("ID_NUMBER")}>
                {renderValue(
                  (customerData?.idNumber as string) ||
                    reservation?.customerNationalId,
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t("PHONE_NUMBER")}>
                {renderValue(
                  customerData?.phoneNumbers
                    ?.map((phone) => phone.phoneNumber)
                    .join(", ") ||
                    reservation?.customerPhoneNumbers
                      ?.map((phone) => phone.phoneNumber)
                      .join(", "),
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t("EMAIL")}>
                {renderValue(customerData?.email)}
              </Descriptions.Item>
              <Descriptions.Item label={t("CUSTOMER_TYPE")}>
                {renderValue(customerData?.customerTypeName)}
              </Descriptions.Item>
              <Descriptions.Item label={t("HAS_MEMBERSHIP")}>
                {renderValue(customerData?.hasMembership)}
              </Descriptions.Item>
              <Descriptions.Item label={t("WHATSAPP_NUMBER")}>
                {renderValue(customerData?.whatsAppNumber as string)}
              </Descriptions.Item>
              <Descriptions.Item label={t("IS_OLD_CUSTOMER")}>
                {renderValue(customerData?.isOld)}
              </Descriptions.Item>
              <Descriptions.Item label={t("NO_OF_RESERVATIONS")}>
                {renderValue(customerData?.noOfReservations as string)}
              </Descriptions.Item>
              <Descriptions.Item label={t("LAST_RESERVATION_DATE")}>
                {renderValue(
                  customerData?.lastReservationDate
                    ? dayjs(customerData.lastReservationDate).format(
                        "DD/MM/YYYY",
                      )
                    : null,
                )}
              </Descriptions.Item>
              {/* <Descriptions.Item label={t("CUSTOMER_FAVOURITES")}>
                {renderValue(
                  `${customerData?.customerFavourites?.favoriteList?.length || 0} Fav / ${customerData?.customerFavourites?.notRecommendedWorkerList?.length || 0} Not Rec`,
                )}
              </Descriptions.Item> */}
            </Descriptions>

            {/* Rendered in its own full-width Descriptions so it always
                takes the whole row, regardless of how the grid above
                divides at the current breakpoint. */}
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label={t("GENERAL_NOTES")}>
                {renderValue(customerData?.generalNotes)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Address Details */}
          <Card
            className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow"
            title={
              <span className="flex items-center gap-2 text-mainColor">
                <span className="w-1.5 h-6 bg-mainOrange rounded-full" />
                {t("SELECTED_ADDRESS_DETAILS")}
              </span>
            }
          >
            <Descriptions
              column={{ xs: 1, sm: 2, lg: 3 }}
              size="small"
              colon={false}
            >
              <Descriptions.Item label={t("ADDRESS")}>
                {renderValue(reservation?.customerAddressName)}
              </Descriptions.Item>
              <Descriptions.Item label={t("CITY")}>
                {renderValue(
                  lang === "en"
                    ? selectedAddress?.cityName
                    : selectedAddress?.cityArName,
                  //   reservation?.cityName || selectedAddress?.cityName?.toString(),
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t("AREA")}>
                {renderValue(
                  lang === "en"
                    ? selectedAddress?.areaName
                    : selectedAddress?.areaArName,
                  //   reservation?.areaName || selectedAddress?.areaName?.toString(),
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t("STREET")}>
                {renderValue(selectedAddress?.street)}
              </Descriptions.Item>
              <Descriptions.Item label={t("APARTMENT")}>
                {renderValue(selectedAddress?.apartment)}
              </Descriptions.Item>
              <Descriptions.Item label={t("FLOOR")}>
                {renderValue(selectedAddress?.floor?.toString())}
              </Descriptions.Item>
              <Descriptions.Item label={t("LANDMARK")}>
                {renderValue(
                  selectedAddress?.landMark || selectedAddress?.landmark,
                )}
              </Descriptions.Item>
            </Descriptions>

            {/* Own full-width Descriptions so these long-text fields always
                take the whole row, regardless of how the grid above
                divides at the current breakpoint. */}
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label={t("DESCRIPTION")}>
                {renderValue(selectedAddress?.fullDescription)}
              </Descriptions.Item>
              <Descriptions.Item label={t("NOTES")}>
                {renderValue(selectedAddress?.notes)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

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
                  {t("SPACE")}
                </Text>
                {renderValue(selectedAddress?.space)}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("NUMBER_OF_KITCHENS")}
                </Text>
                {renderValue(
                  selectedAddress?.numberOfKitchens?.toString() ?? null,
                )}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("NUMBER_OF_BEDROOMS")}
                </Text>
                {renderValue(
                  selectedAddress?.numberOfBedrooms?.toString() ?? null,
                )}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("NUMBER_OF_BATHROOMS")}
                </Text>
                {renderValue(
                  selectedAddress?.numberOfBathrooms?.toString() ?? null,
                )}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("NUMBER_OF_LIVING_ROOMS")}
                </Text>
                {renderValue(
                  selectedAddress?.numberOfLivingRooms?.toString() ?? null,
                )}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("NUMBER_OF_RECEPTION_ROOMS")}
                </Text>
                {renderValue(
                  selectedAddress?.numberOfReceptionrooms?.toString() ?? null,
                )}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("NUMBER_OF_FLOORS")}
                </Text>
                {renderValue(
                  selectedAddress?.noOfFloors?.toString() ??
                    selectedAddress?.numberOfFloors?.toString() ??
                    null,
                )}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("NUMBER_OF_WINDOWS")}
                </Text>
                {renderValue(
                  selectedAddress?.numberOfWindows?.toString() ?? null,
                )}
              </div>
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs mb-1">
                  {t("HAS_PETS")}
                </Text>
                {renderValue(selectedAddress?.hasPets)}
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
            {reservation?.reservationWorkers &&
            reservation?.reservationWorkers?.length > 0 ? (
              // Grid: up to 5 per row on large screens, max 3 rows then scroll.
              // Row height 3rem (h-12) + gap 1rem → 3 rows = 11rem.
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-44 overflow-y-auto pr-1">
                {reservation?.reservationWorkers?.map((worker) => (
                  <div
                    key={worker.workerId}
                    className="flex items-center gap-2 h-12 rounded-lg border border-gray-200 bg-gray-50 px-3"
                  >
                    <span className="w-[3px] h-6 bg-mainOrange rounded-full shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase tracking-wide text-gray-400 leading-none">
                        {t("WORKER")}
                      </span>
                      <span className="font-semibold truncate leading-tight">
                        {lang === "ar"
                          ? worker.workerArName
                          : worker.workerName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="flex items-center justify-center w-full">
                {t("NA")}
              </p>
            )}
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
                              className="[&_.ant-list-items]:grid [&_.ant-list-items]:grid-cols-1 sm:[&_.ant-list-items]:grid-cols-2 lg:[&_.ant-list-items]:grid-cols-3 [&_.ant-list-items]:gap-2"
                              renderItem={(item) => (
                                <List.Item className="py-0! px-0! border-none">
                                  <Tag className="w-full flex flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-full px-2.5 py-1 text-xs bg-mainOrange/20 text-mainOrange border-mainOrange">
                                    <div className="flex items-start gap-1.5">
                                      <div className="w-1 h-1 mt-1 rounded-full bg-mainOrange shrink-0" />
                                      <span className="wrap-break-word">
                                        {item.service}
                                      </span>
                                    </div>
                                    <Text className="text-xs! font-semibold text-mainOrange! shrink-0">
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

                      {pkg.getPackageDto?.rules &&
                        pkg.getPackageDto.rules.length > 0 && (
                          <>
                            <Divider className="my-4" />
                            <div>
                              <Text
                                type="secondary"
                                className="text-xs block mb-3 font-bold uppercase tracking-wider"
                              >
                                {t("RULES")}
                              </Text>
                              <ul className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                                {pkg.getPackageDto.rules.map((rule, ruleIdx) => (
                                  <li
                                    key={ruleIdx}
                                    className="flex items-start gap-2.5"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mainOrange" />
                                    <span className="text-sm leading-relaxed text-mainTextLight normal-case">
                                      {rule}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
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
                    let totalWorkers = 0;

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
                        totalWorkers +=
                          Number(packageDto.numberOfWorkers) || 0;

                        return (
                          <div
                            key={index}
                            className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                              <span className="font-semibold text-[#1D1B1B] capitalize wrap-break-word">
                                {lang
                                  ? (packageDto.arTitle as string)
                                  : (packageDto.title as string)}
                              </span>
                              <span className="text-gray-700 font-medium shrink-0">
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
                                      className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-sm ps-2"
                                    >
                                      <span className="text-gray-600 capitalize wrap-break-word">
                                        {es.service as string}
                                      </span>
                                      <span className="text-gray-700 shrink-0">
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

                    const transportationFee =
                      Number(reservation?.getTransportationFeesDetails?.fee) ||
                      0;
                    // Transportation is charged per worker across all packages
                    const transportationTotal =
                      totalWorkers * transportationFee;
                    grandTotal += transportationTotal;

                    return (
                      <>
                        {packageRows}
                        {transportationFee > 0 && totalWorkers > 0 && (
                          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                            <span className="font-medium capitalize text-[#1D1B1B]">
                              {t("TRANSPORTATION_FEES")}
                              <span className="ms-2 text-xs font-normal normal-case text-gray-500">
                                ({totalWorkers} {t("WORKERS")} ×{" "}
                                {transportationFee.toLocaleString()} {t("EGP")})
                              </span>
                            </span>
                            <span className="text-gray-700 shrink-0">
                              + {transportationTotal.toLocaleString()} {t("EGP")}
                            </span>
                          </div>
                        )}
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
