// import { useLocation } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Title from "../../../components/Common/Title/title";
import { useTranslation } from "react-i18next";
import type {
  APIErrorProps,
  reservationFormProps,
} from "../../../components/Utilities/Types/types";
import { Button, Collapse, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  useGetAllCustomerAddressesQuery,
  useGetAllCustomersDDLQuery,
  useGetAllPackagesListQuery,
  useGetAllTransportationFeesQuery,
  useGetApartmentClosingPeriodQuery,
  useGetAreasQuery,
  useGetCitiesQuery,
} from "../../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import { useGetCustomerByIdQuery } from "../../../components/APIs/ClientQuery/CLIENTS_QUERY";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppSelector } from "../../../components/APIs/store";
import { FaMinus, FaPlus } from "react-icons/fa";
import ExtraPackage from "./packageComponent";
import TextArea from "antd/es/input/TextArea";
import { useAddReservationMutation } from "../../../components/APIs/Reservations/RESERVATION_QUERY";
import { toast } from "react-toastify";
import Astrisk from "../../../components/Common/Astrisk/astrisk";
import { useNavigate } from "react-router-dom";

// const extraOptions = [
//   "EXTRA_BATHROOM",
//   "CLEAN_KITCHEN",
//   "BUYING_TOOLS",
//   "EXTRA_MATERIAL",
//   "EXTRA_WORKERS",
// ];

const ReservationForm = () => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state?.lang);
  const navigate = useNavigate();

  const [addReservation, { isLoading: isAddReservationLoading }] =
    useAddReservationMutation();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<reservationFormProps>({
    defaultValues: {
      addReservationPackagesDtos: [
        {
          packageId: "",
          count: 1,
          packageAmount: "",
          reservationPackageExtraServices: [
            {
              packageExtraServiceId: undefined,
            },
          ],
        },
      ],
    },
  });

  const customerId = watch("customerId");

  // all customers
  const {
    data: customers,
    isLoading: customersLoading,
    isFetching: customersIsFetching,
  } = useGetAllCustomersDDLQuery();

  // all addresses of customer
  const {
    data: addresses,
    isLoading: addressesLoading,
    isFetching: addressesIsFetching,
  } = useGetAllCustomerAddressesQuery(
    customerId ? { id: customerId.toString() } : skipToken,
  );

  // customer by id
  const {
    data: customer,
    isLoading: customerLoading,
    isFetching: customerIsFetching,
  } = useGetCustomerByIdQuery(
    customerId ? { id: customerId.toString() } : skipToken,
  );

  // cities
  const {
    data: cities,
    isFetching: isCitiesFetching,
    isLoading: isCitiesLoading,
  } = useGetCitiesQuery();

  const cityId = watch("cityId");
  const areaId = watch("areaId");

  const {
    data: areas,
    isFetching: isAreasFetching,
    isLoading: isAreasLoading,
  } = useGetAreasQuery(cityId ? { cityId } : skipToken);

  // transportation fees
  const {
    data: transportationFees,
    isLoading: transportationFeesLoading,
    isFetching: transportationFeesIsFetching,
  } = useGetAllTransportationFeesQuery();

  // apartment closing period
  const {
    data: apartmentClosingPeriod,
    isLoading: apartmentClosingPeriodLoading,
    isFetching: apartmentClosingPeriodIsFetching,
  } = useGetApartmentClosingPeriodQuery();

  // all packages
  const {
    data: packages,
    isLoading: packagesLoading,
    isFetching: packagesIsFetching,
  } = useGetAllPackagesListQuery();

  const {
    fields: packagesFields,
    append: packagesAppend,
    remove: packagesRemove,
  } = useFieldArray({
    name: "addReservationPackagesDtos",
    control,
    rules: {
      required: {
        value: true,
        message: t("REQUIRED"),
      },
    },
  });

  const handlePackageAppend = () => {
    packagesAppend({
      packageId: "",
      count: "",
      packageAmount: "",
      reservationPackageExtraServices: [],
    });
  };

  const handlePackageRemove = (index: number) => {
    packagesRemove(index);
  };
  // console.log(packages);

  // const [selectedRadio, setSelectedRadio] = useState(0);

  useEffect(() => {
    if (customer) {
      setValue("firstName", customer.data?.firstName || t("NA"));
      setValue("middleName", customer.data?.middleName || t("NA"));
      setValue("lastName", customer.data?.lastName || t("NA"));
      setValue("idNumber", customer.data?.idNumber || t("NA"));
      setValue(
        "phoneNumber",
        customer.data?.phoneNumbers[0].phoneNumber || t("NA"),
      );
      setValue("email", customer.data?.email || t("NA"));
    }
  }, [customer]);

  const handleSubmitForm = async (data: reservationFormProps) => {
    const formattedData = {
      ...data,
      reservationDate: dayjs(data?.reservationDate)?.toISOString(),
      addReservationPackagesDtos: data?.addReservationPackagesDtos?.map(
        (item) => ({
          ...item,
          count: 1,
          reservationPackageExtraServices:
            item?.reservationPackageExtraServices?.filter(
              (extraService) => extraService?.packageExtraServiceId,
            ),
        }),
      ),
      insects: data?.insects === "true",
      rodents: data?.rodents === "true",
    };

    try {
      await addReservation(formattedData).unwrap();
      toast.success("Reservation added successfully");
      navigate("/reservations");
      reset();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }

    // console.log(formattedData);
  };

  return (
    <main className="px-6">
      <header>
        <Title title={t("ADD_RESERVATION")} subTitle />
      </header>

      <section className="mt-4 form-container">
        <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
          <div className="flex flex-col gap-15 [&>section]:grid [&>section]:grid-cols-1 [&>section]:md:grid-cols-2 [&>section]:lg:grid-cols-3 [&>section]:gap-5 [&>section>div>label]:block [&>section>div>label]:mb-1 [&>section>div>label]:capitalize [&>section>div>label]:font-medium [&>section>div>input]:border-[#C4C4C4] [&>section>div>select]:border-[#C4C4C4] [&>section>div>input]:py-2 [&>section>div>select]:py-2 [&>section>div>p]:mt-1 [&>section>div>p]:text-xs [&>section>div>p]:text-mainRed">
            <section className="customer-selection-wrapper ">
              <div className="col-span-2 lg:col-span-1 text-xl text-[#1D1B1B]">
                <label className="font-semibold">
                  {t("SELECT_CUSTOMER")}
                  <Astrisk />
                </label>

                <Controller
                  control={control}
                  name="customerId"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      loading={customersLoading || customersIsFetching}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.customerId ? "error" : ""}
                      // defaultValue="male"
                      placeholder="Select Customer"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={customers?.data?.map((customer) => ({
                        value: customer.id,
                        label: customer.name,
                      }))}
                    />
                  )}
                />

                {errors?.customerId ? (
                  <p className="font-light">{errors?.customerId?.message}</p>
                ) : null}
              </div>

              <div className="col-span-2 lg:col-span-1 text-xl text-[#1D1B1B]">
                <label className="font-semibold">
                  {t("SELECT_ADDRESS")}
                  <Astrisk />
                </label>

                <Controller
                  control={control}
                  name="customerAddressId"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      disabled={
                        !customerId || customerLoading || customerIsFetching
                      }
                      loading={addressesLoading || addressesIsFetching}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.customerAddressId ? "error" : ""}
                      // defaultValue="male"
                      placeholder="Select Address"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={addresses?.data?.map((address) => ({
                        value: address.id,
                        label: address.name || "---",
                      }))}
                    />
                  )}
                />

                {errors?.customerAddressId ? (
                  <p className="font-light">
                    {errors?.customerAddressId?.message}
                  </p>
                ) : null}
              </div>
            </section>

            <section className="personal-info-section ">
              <div className="personal-title capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
                {t("PERSONAL_INFO")}
              </div>

              <div>
                <label>{t("FIRST_NAME")}</label>
                <Controller
                  control={control}
                  name="firstName"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: t("REQUIRED"),
                  //   },
                  // }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter first name"
                      className="placeholder:capitalize"
                      status={errors?.firstName ? "error" : ""}
                      readOnly
                      disabled={
                        !customerId || customerLoading || customerIsFetching
                      }
                    />
                  )}
                />

                {errors?.firstName ? <p>{errors?.firstName?.message}</p> : null}
              </div>

              <div>
                <label>{t("MIDDLE_NAME")}</label>
                <Controller
                  control={control}
                  name="middleName"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: t("REQUIRED"),
                  //   },
                  // }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter middle name"
                      className="placeholder:capitalize"
                      status={errors?.middleName ? "error" : ""}
                      readOnly
                      disabled={
                        !customerId || customerLoading || customerIsFetching
                      }
                    />
                  )}
                />

                {errors?.middleName ? (
                  <p>{errors?.middleName?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("LAST_NAME")}</label>
                <Controller
                  control={control}
                  name="lastName"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: t("REQUIRED"),
                  //   },
                  // }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter last name"
                      className="placeholder:capitalize"
                      status={errors?.lastName ? "error" : ""}
                      readOnly
                      disabled={
                        !customerId || customerLoading || customerIsFetching
                      }
                    />
                  )}
                />

                {errors?.lastName ? <p>{errors?.lastName?.message}</p> : null}
              </div>

              <div>
                <label>{t("ID_NUMBER")}</label>
                <Controller
                  control={control}
                  name="idNumber"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: t("REQUIRED"),
                  //   },
                  // }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter id number"
                      className="placeholder:capitalize"
                      status={errors?.idNumber ? "error" : ""}
                      readOnly
                      disabled={
                        !customerId || customerLoading || customerIsFetching
                      }
                    />
                  )}
                />

                {errors?.idNumber ? <p>{errors?.idNumber?.message}</p> : null}
              </div>

              <div>
                <label>{t("PHONE_NUMBER")}</label>
                <Controller
                  control={control}
                  name="phoneNumber"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: t("REQUIRED"),
                  //   },
                  // }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter phone number"
                      className="placeholder:capitalize"
                      status={errors?.phoneNumber ? "error" : ""}
                      readOnly
                      disabled={
                        !customerId || customerLoading || customerIsFetching
                      }
                    />
                  )}
                />

                {errors?.phoneNumber ? (
                  <p>{errors?.phoneNumber?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("EMAIL")}</label>
                <Controller
                  control={control}
                  name="email"
                  // rules={{
                  //   required: {
                  //     value: true,
                  //     message: t("REQUIRED"),
                  //   },
                  // }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter email"
                      className="placeholder:capitalize"
                      status={errors?.email ? "error" : ""}
                      readOnly
                      disabled={
                        !customerId || customerLoading || customerIsFetching
                      }
                    />
                  )}
                />

                {errors?.email ? <p>{errors?.email?.message}</p> : null}
              </div>
            </section>

            <section className="reservation-details-wrapper">
              <div className="reservation-details-title capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
                {t("CUSTOMER_RESERVATION_DETAILS")}
              </div>

              {/* Reservation Date */}
              <div>
                <label>
                  {t("RESERVATION_DATE")}
                  <Astrisk />
                </label>
                <Controller
                  control={control}
                  name="reservationDate"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      className="w-full p-2 border-[#C4C4C4] border rounded-md"
                      variant="filled"
                      placeholder="Select reservation date"
                      status={errors?.reservationDate ? "error" : ""}
                      showTime
                      // disabled={
                      //   !customerId || customerLoading || customerIsFetching
                      // }
                    />
                  )}
                />

                {errors?.reservationDate ? (
                  <p>{errors?.reservationDate?.message}</p>
                ) : null}
              </div>

              {/* INSECTS */}
              <div>
                <label>
                  {t("INSECTS")}
                  <Astrisk />
                </label>
                <Controller
                  control={control}
                  name={`insects`}
                  rules={{
                    required: { value: true, message: t("REQUIRED") },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                      placeholder="Insects?"
                      variant="filled"
                      status={errors?.insects ? "error" : ""}
                      options={[
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                      ]}
                    />
                  )}
                />
                {errors?.insects && <p>{errors.insects.message}</p>}
              </div>

              {/* RODENTS */}
              <div>
                <label>
                  {t("RODENTS")}
                  <Astrisk />
                </label>
                <Controller
                  control={control}
                  name={`rodents`}
                  rules={{
                    required: { value: true, message: t("REQUIRED") },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                      placeholder="Rodents?"
                      variant="filled"
                      status={errors?.rodents ? "error" : ""}
                      options={[
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                      ]}
                    />
                  )}
                />
                {errors?.rodents && <p>{errors.rodents.message}</p>}
              </div>

              {/* APARTMENT CLOSING PERIOD */}
              <div>
                <label className="font-semibold">
                  {t("APARTMENT_CLOSING_PERIOD")}
                  <Astrisk />
                </label>

                <Controller
                  control={control}
                  name="apartmentClosingPeriodId"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      loading={
                        apartmentClosingPeriodLoading ||
                        apartmentClosingPeriodIsFetching
                      }
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.apartmentClosingPeriodId ? "error" : ""}
                      // defaultValue="male"
                      placeholder="Select apartment closing period"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={apartmentClosingPeriod?.data?.map((period) => ({
                        value: period?.id,
                        label: lang === "en" ? period?.name : period?.arName,
                      }))}
                    />
                  )}
                />

                {errors?.apartmentClosingPeriodId ? (
                  <p className="font-light">
                    {errors?.apartmentClosingPeriodId?.message}
                  </p>
                ) : null}
              </div>
            </section>

            <section className="transportation-fees-wrapper">
              <div className="transportation-fees-title capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
                {t("TRANSPORTATION_FEES_DETAILS")}
              </div>

              {/* CITY */}
              <div>
                <label className="font-semibold">
                  {t("CITY")}
                  <Astrisk />
                </label>

                <Controller
                  control={control}
                  name="cityId"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      loading={isCitiesLoading || isCitiesFetching}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.cityId ? "error" : ""}
                      // defaultValue="male"
                      placeholder="Select city"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={cities?.data?.map((city) => ({
                        value: city?.id,
                        label: lang === "en" ? city?.name : city?.arName,
                      }))}
                    />
                  )}
                />

                {errors?.cityId ? (
                  <p className="font-light">{errors?.cityId?.message}</p>
                ) : null}
              </div>

              {/* AREA */}
              <div>
                <label className="font-semibold">
                  {t("AREA")}
                  <Astrisk />
                </label>

                <Controller
                  control={control}
                  name="areaId"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      loading={isAreasLoading || isAreasFetching}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.areaId ? "error" : ""}
                      disabled={!cityId}
                      placeholder="Select area"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={areas?.data?.map((area) => ({
                        value: area?.id,
                        label: lang === "en" ? area?.name : area?.arName,
                      }))}
                    />
                  )}
                />

                {errors?.areaId ? (
                  <p className="font-light">{errors?.areaId?.message}</p>
                ) : null}
              </div>

              {/* TRANSPORTATION FEES */}
              <div>
                <label className="font-semibold">
                  {t("TRANSPORTATION_FEES")}
                  <Astrisk />
                </label>

                <Controller
                  control={control}
                  name="transportationFeesId"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      loading={
                        transportationFeesLoading ||
                        transportationFeesIsFetching
                      }
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.transportationFeesId ? "error" : ""}
                      disabled={!cityId || !areaId}
                      placeholder="Select transportation fees"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={transportationFees?.data
                        ?.filter(
                          (fee) =>
                            fee.cityId === cityId && fee.areaId === areaId,
                        )
                        ?.map((fee) => ({
                          value: fee.id,
                          label: fee.fee || "---",
                        }))}
                    />
                  )}
                />

                {errors?.transportationFeesId ? (
                  <p className="font-light">
                    {errors?.transportationFeesId?.message}
                  </p>
                ) : null}
              </div>
            </section>

            <section className="packages-wrapper">
              <div className="packages-title flex items-center gap-3 capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
                <span>{t("EXTRA_SERVICE_DETAILS")}</span>

                <Button
                  onClick={handlePackageAppend}
                  className="text-sm cursor-pointer bg-green-600 text-white"
                  icon={<FaPlus />}
                  shape="circle"
                />
              </div>

              <div className="package-dropdown-wrapper flex flex-col gap-5 w-full col-span-full">
                {packagesFields.map((field, index) => (
                  <section
                    key={field.id}
                    className="w-full flex flex-wrap items-center gap-3"
                  >
                    {/* <div className="flex items-center justify-between gap-3">
                      <div className="w-full flex flex-col gap-2">
                        <label className="font-semibold capitalize">
                          {t("SELECT_PACKAGE_TYPE")}
                        </label>

                        <div className="select-wrapper grow flex items-center gap-3">
                          <Controller
                            control={control}
                            name={`addReservationPackagesDtos.${index}.packageId`}
                            rules={{
                              required: {
                                value: true,
                                message: t("REQUIRED"),
                              },
                            }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                loading={packagesLoading || packagesIsFetching}
                                className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                                variant="filled"
                                status={
                                  errors?.addReservationPackagesDtos?.[index]
                                    ?.packageId
                                    ? "error"
                                    : ""
                                }
                                placeholder="Select package"
                                style={{ width: "100%" }}
                                onChange={(e) => {
                                  field.onChange(e);
                                  //   handleChange(e);
                                }}
                                options={packages?.data?.map((pkg) => ({
                                  value: pkg.id,
                                  label: lang === "en" ? pkg.name : pkg.arName,
                                }))}
                              />
                            )}
                          />

                          <Button
                            onClick={() => handlePackageRemove(index)}
                            className="text-lg cursor-pointer bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                            icon={<FaMinus />}
                            shape="circle"
                            disabled={packagesFields?.length === 1}
                          />
                        </div>
                      </div>
                    </div> */}

                    <Collapse
                      className="grow [&_.ant-collapse-header]:items-center"
                      accordion
                      destroyOnHidden={false}
                      items={[
                        {
                          key: "1",
                          forceRender: true,
                          label: (
                            <div
                              className="flex items-center justify-between gap-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="w-full flex flex-col gap-2">
                                <Controller
                                  control={control}
                                  name={`addReservationPackagesDtos.${index}.packageId`}
                                  rules={{
                                    required: {
                                      value: true,
                                      message: t("REQUIRED"),
                                    },
                                  }}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      loading={
                                        packagesLoading || packagesIsFetching
                                      }
                                      value={field?.value || null}
                                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                                      variant="filled"
                                      status={
                                        errors?.addReservationPackagesDtos?.[
                                          index
                                        ]?.packageId
                                          ? "error"
                                          : ""
                                      }
                                      placeholder="Select package"
                                      style={{ width: "100%" }}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        //   handleChange(e);
                                      }}
                                      options={
                                        packages?.data?.map((pkg) => ({
                                          value: pkg.id,
                                          label:
                                            lang === "en"
                                              ? pkg.name
                                              : pkg.arName,
                                        })) || []
                                      }
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          ),
                          children: (
                            <ExtraPackage
                              index={index}
                              control={control}
                              errors={errors}
                              watch={watch}
                              setValue={setValue}
                            />
                          ),
                        },
                      ]}
                    />

                    <Button
                      onClick={() => handlePackageRemove(index)}
                      className="text-lg cursor-pointer bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                      icon={<FaMinus />}
                      shape="circle"
                      disabled={packagesFields?.length === 1}
                    />

                    <p className="basis-full text-xs text-red-500 capitalize">
                      {
                        errors?.addReservationPackagesDtos?.[index]?.packageId
                          ?.message
                      }
                    </p>
                  </section>
                ))}
              </div>
            </section>

            <div className="md:col-span-full">
              <label className="font-semibold mb-1 block">
                {t("GENERAL_NOTES")}
                <Astrisk />
              </label>
              <Controller
                control={control}
                name={`generalComments`}
                rules={{
                  required: { value: true, message: t("REQUIRED") },
                }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    variant="filled"
                    placeholder="Enter general comments"
                    className="placeholder:capitalize border-[#C4C4C4] border rounded-md py-2 min-h-[70px] resize-none"
                    status={errors?.generalComments ? "error" : ""}
                  />
                )}
              />
              {errors?.generalComments && (
                <p className="text-xs text-red-500 mt-1">
                  {errors?.generalComments?.message}
                </p>
              )}
            </div>
          </div>

          <section className="btn-wrapper mt-8 flex items-center justify-center gap-4 [&>div>button]:capitalize [&>div>button]:min-w-[120px] [&>div>button]:py-5 ">
            {/* <div>
              <Button
                variant="outlined"
                className="bg-transparent text-mainColor border-mainColor hover:bg-gray-600/80 hover:border-gray-600/80 hover:text-white transition-colors duration-500"
              >
                {t("BACK")}
              </Button>
            </div> */}
            <div>
              <Button
                htmlType="submit"
                variant="filled"
                className="bg-mainColor text-white"
                disabled={isAddReservationLoading}
                loading={isAddReservationLoading}
              >
                {t("SUBMIT")}
              </Button>
            </div>
          </section>
        </form>
      </section>
    </main>
  );
};

export default ReservationForm;
