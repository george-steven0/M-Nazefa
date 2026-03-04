import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import {
  Button,
  Modal,
  Select,
  Skeleton,
  Card,
  Descriptions,
  Tag,
  Divider,
  Typography,
  Avatar,
  List,
  type SelectProps,
} from "antd";
import { useState } from "react";
import type { DefaultOptionType } from "antd/es/select";
import { FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useGetReservationByIdQuery } from "../../../components/APIs/Reservations/RESERVATION_QUERY";
import { skipToken } from "@reduxjs/toolkit/query";
import dayjs from "dayjs";

const { Text, Title: TypographyTitle } = Typography;

const ReservationDetails = () => {
  const { t, i18n } = useTranslation();
  const [params] = useSearchParams();
  const id = params.get("id");
  const isAr = i18n.language === "ar";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setselectedOptions] = useState<
    DefaultOptionType | DefaultOptionType[] | undefined
  >([]);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const options: SelectProps["options"] = [
    { value: "1", label: "worker 1" },
    { value: "2", label: "worker 2" },
    { value: "3", label: "worker 3" },
    { value: "4", label: "worker 4" },
    { value: "5", label: "worker 5" },
  ];

  const handleChange = (
    _value: string[],
    obj: DefaultOptionType | DefaultOptionType[] | undefined,
  ) => {
    setselectedOptions(obj);
  };

  const {
    data: reservationData,
    isLoading,
    isFetching,
  } = useGetReservationByIdQuery(id ? { id } : skipToken);

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
            {/* <div className="flex gap-3">
              <Button
                type="primary"
                className="bg-mainColor hover:bg-mainColor/90! border-none px-6 py-5 h-auto rounded-xl flex items-center justify-center font-semibold"
                onClick={toggleModal}
              >
                {t("ASSIGN_WORKERS")}
              </Button>
            </div> */}
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
                  {renderValue(reservation?.idNumber)}
                </Descriptions.Item>
                <Descriptions.Item label={t("PHONE_NUMBER")}>
                  {renderValue(reservation?.phoneNumber)}
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
                <Descriptions.Item label={t("AMOUNT")}>
                  <div className="text-mainOrange font-bold text-lg">
                    {reservation?.reservationAmount ?? 0} L.E
                  </div>
                </Descriptions.Item>
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
                        {isAr
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
                            {isAr
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
          </div>
        </div>
      </main>

      <Modal
        title={t("ASSIGN_WORKERS")}
        open={isModalOpen}
        onOk={toggleModal}
        onCancel={toggleModal}
        zIndex={9999}
        footer={
          <div className="flex justify-center gap-2 p-4">
            <Button
              className="min-w-[150px] bg-mainColor text-white h-12 rounded-xl text-lg font-semibold hover:bg-mainColor/90! transition-all shadow-md"
              onClick={toggleModal}
            >
              {t("SAVE")}
            </Button>
          </div>
        }
        className="rounded-3xl overflow-hidden"
      >
        <section className="my-4">
          <div className="mb-6">
            <Text type="secondary" className="mb-2 block">
              {t("SELECT_WORKERS_DESCRIPTION") ||
                "Search and select workers to assign to this reservation"}
            </Text>
            <Select
              mode="multiple"
              allowClear
              className="w-full h-12"
              placeholder={t("SELECT_WORKER") || "Please select worker"}
              value={selectedOptions?.map(
                (worker: DefaultOptionType) => worker.value,
              )}
              onChange={handleChange}
              options={options}
            />
          </div>

          <div className="mt-4 max-h-[300px] overflow-y-auto">
            <TypographyTitle
              level={5}
              className="text-sm! text-gray-400! mb-3! uppercase tracking-widest"
            >
              {t("SELECTED_WORKERS") || "Selected Workers"}
            </TypographyTitle>
            <div className="flex flex-col gap-2">
              {selectedOptions?.length > 0 ? (
                selectedOptions?.map((worker: DefaultOptionType) => (
                  <div
                    key={worker.value}
                    className="flex justify-between items-center bg-gray-50 p-3 px-4 rounded-xl border border-gray-100 hover:border-mainColor/30 transition-colors"
                  >
                    <span className="font-medium text-mainColor">
                      {worker.label}
                    </span>
                    <Button
                      type="text"
                      danger
                      icon={<FaTrash />}
                      onClick={() => {
                        setselectedOptions(
                          (selectedOptions as DefaultOptionType[]).filter(
                            (item) => item.value !== worker.value,
                          ),
                        );
                      }}
                      className="flex items-center justify-center hover:bg-red-50"
                    />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <Text type="secondary">
                    {t("NO_WORKERS_SELECTED") || "No workers selected"}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </section>
      </Modal>
    </>
  );
};

export default ReservationDetails;
