// import { useLocation } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import Title from "../../../components/Common/Title/title";
import { useTranslation } from "react-i18next";
import type { reservationFormProps } from "../../../components/Utilities/Types/types";
import { Button, DatePicker, Input, Radio, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const extraOptions = [
  "EXTRA_BATHROOM",
  "CLEAN_KITCHEN",
  "BUYING_TOOLS",
  "EXTRA_MATERIAL",
  "EXTRA_WORKERS",
];

const EditReservation = () => {
  const { t } = useTranslation();
  //   const {
  //     state: { id },
  //   } = useLocation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<reservationFormProps>();

  const [selectedRadio, setSelectedRadio] = useState(0);

  const handleSubmitForm = (data: reservationFormProps) => {
    const formattedData = {
      ...data,
      date: dayjs(data.date).format("YYYY-MM-DD"),
      startTime: dayjs(data.startTime).format("HH:mm"),
      endTime: dayjs(data.endTime).format("HH:mm"),
      duration: data?.duration?.map((item) => dayjs(item).format("HH:mm")),
    };
    console.log(formattedData);
  };

  // console.log(errors);

  return (
    <main className="px-6">
      <header>
        <Title title={t("EDIT_RESERVATION")} subTitle />
      </header>

      <section className="mt-4 form-container">
        <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
          <div className="flex flex-col gap-15 [&>section]:grid [&>section]:grid-cols-1 [&>section]:md:grid-cols-2 [&>section]:lg:grid-cols-3 [&>section]:gap-5 [&>section>div>label]:block [&>section>div>label]:mb-1 [&>section>div>label]:capitalize [&>section>div>label]:font-medium [&>section>div>input]:border-[#C4C4C4] [&>section>div>select]:border-[#C4C4C4] [&>section>div>input]:py-2 [&>section>div>select]:py-2 [&>section>div>p]:mt-1 [&>section>div>p]:text-xs [&>section>div>p]:text-mainRed">
            <section className="customer-selection-wrapper ">
              <div className="col-span-2 lg:col-span-1 text-xl text-[#1D1B1B] ">
                <label className="font-semibold">{t("SELECT_CUSTOMER")}</label>

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
                      options={[
                        { value: "1", label: "John Doe" },
                        { value: "2", label: "Nancy Williams" },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                        // { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                  )}
                />

                {errors?.customerId ? (
                  <p>{errors?.customerId?.message}</p>
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
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter first name"
                      className="placeholder:capitalize"
                      status={errors?.firstName ? "error" : ""}
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
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter middle name"
                      className="placeholder:capitalize"
                      status={errors?.middleName ? "error" : ""}
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
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter last name"
                      className="placeholder:capitalize"
                      status={errors?.lastName ? "error" : ""}
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
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter id number"
                      className="placeholder:capitalize"
                      status={errors?.idNumber ? "error" : ""}
                    />
                  )}
                />

                {errors?.idNumber ? <p>{errors?.idNumber?.message}</p> : null}
              </div>

              {/* <div>
                <label>{t("PHONE_NUMBER")}</label>
                <Controller
                  control={control}
                  name="phoneNumber"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter phone number"
                      className="placeholder:capitalize"
                      status={errors?.phoneNumber ? "error" : ""}
                    />
                  )}
                />

                {errors?.phoneNumber ? (
                  <p>{errors?.phoneNumber?.message}</p>
                ) : null}
              </div> */}

              <div>
                <label>{t("EMAIL")}</label>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Email is not valid",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter email"
                      className="placeholder:capitalize"
                      status={errors?.email ? "error" : ""}
                    />
                  )}
                />

                {errors?.email ? <p>{errors?.email?.message}</p> : null}
              </div>
            </section>

            {/* <section className="address-info-section">
              <div className="address-title capitalize col-span-full text-xl text-[#1D1B1B] font-semibold ">
                {t("ADDRESS")}
              </div>

              <div>
                <label>{t("CITY")}</label>
                <Controller
                  control={control}
                  name="city"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter city"
                      className="placeholder:capitalize"
                      status={errors?.city ? "error" : ""}
                    />
                  )}
                />

                {errors?.city ? <p>{errors?.city?.message}</p> : null}
              </div>

              <div>
                <label>{t("AREA")}</label>
                <Controller
                  control={control}
                  name="area"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter area"
                      className="placeholder:capitalize"
                      status={errors?.area ? "error" : ""}
                    />
                  )}
                />

                {errors?.area ? <p>{errors?.area?.message}</p> : null}
              </div>

              <div>
                <label>{t("STREET")}</label>
                <Controller
                  control={control}
                  name="street"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter street"
                      className="placeholder:capitalize"
                      status={errors?.street ? "error" : ""}
                    />
                  )}
                />

                {errors?.street ? <p>{errors?.street?.message}</p> : null}
              </div>

              <div>
                <label>{t("APARTMENT")}</label>
                <Controller
                  control={control}
                  name="apartment"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter apartment number"
                      className="placeholder:capitalize"
                      status={errors?.apartment ? "error" : ""}
                    />
                  )}
                />

                {errors?.apartment ? <p>{errors?.apartment?.message}</p> : null}
              </div>

              <div>
                <label>{t("FLOOR")}</label>
                <Controller
                  control={control}
                  name="floor"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter floor number"
                      className="placeholder:capitalize"
                      status={errors?.floor ? "error" : ""}
                    />
                  )}
                />

                {errors?.floor ? <p>{errors?.floor?.message}</p> : null}
              </div>

              <div>
                <label>{t("POSTAL_CODE")}</label>
                <Controller
                  control={control}
                  name="postalCode"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter postal code"
                      className="placeholder:capitalize"
                      status={errors?.postalCode ? "error" : ""}
                    />
                  )}
                />

                {errors?.postalCode ? (
                  <p>{errors?.postalCode?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("LANDMARK")}</label>
                <Controller
                  control={control}
                  name="landmark"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter landmark"
                      className="placeholder:capitalize"
                      status={errors?.landmark ? "error" : ""}
                    />
                  )}
                />

                {errors?.landmark ? <p>{errors?.landmark?.message}</p> : null}
              </div>

              <div className="col-span-2">
                <label>{t("DESCRIPTION")}</label>
                <Controller
                  control={control}
                  name="description"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter description"
                      className="placeholder:capitalize"
                      status={errors?.description ? "error" : ""}
                    />
                  )}
                />

                {errors?.description ? (
                  <p>{errors?.description?.message}</p>
                ) : null}
              </div>
            </section> */}

            <section className="appintment-info-wrapper">
              <div className="capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
                {t("ADD_APPOINTMENT")}
              </div>

              <div>
                <label>{t("DATE_OF_BIRTH")}</label>
                <Controller
                  control={control}
                  name="date"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      className="min-h-10 w-full border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      {...field}
                      variant="filled"
                      status={errors?.date ? "error" : ""}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(e) => {
                        field.onChange(dayjs(e));
                      }}
                    />
                  )}
                />
                {errors?.date ? <p>{errors?.date?.message}</p> : null}
              </div>

              <div>
                <label>{t("FROM_TIME")}</label>
                <Controller
                  control={control}
                  name="startTime"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <TimePicker
                      className="min-h-10 w-full border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      {...field}
                      variant="filled"
                      status={errors?.startTime ? "error" : ""}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(e) => {
                        field.onChange(dayjs(e));
                      }}
                    />
                  )}
                />
                {errors?.startTime ? <p>{errors?.startTime?.message}</p> : null}
              </div>

              <div>
                <label>{t("TO_TIME")}</label>
                <Controller
                  control={control}
                  name="endTime"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <TimePicker
                      className="min-h-10 w-full border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      {...field}
                      variant="filled"
                      status={errors?.endTime ? "error" : ""}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(e) => {
                        field.onChange(dayjs(e));
                      }}
                    />
                  )}
                />
                {errors?.endTime ? <p>{errors?.endTime?.message}</p> : null}
              </div>
            </section>

            {/* <section className="bulding-info-wrapper">
              <div className="capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
                {t("BUILDING_DETAILS")}
              </div>

              <div>
                <label>{t("SPACE")}</label>
                <Controller
                  control={control}
                  name="space"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter space"
                      className="placeholder:capitalize"
                      status={errors?.space ? "error" : ""}
                    />
                  )}
                />

                {errors?.space ? <p>{errors?.space?.message}</p> : null}
              </div>

              <div>
                <label>{t("BUILDING_TYPE")}</label>

                <Controller
                  control={control}
                  name="buildType"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.buildType ? "error" : ""}
                      // defaultValue="male"
                      placeholder="Select building type"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={[
                        { value: "1", label: "Apartment" },
                        { value: "2", label: "flat" },
                        { value: "3", label: "villa" },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                        // { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                  )}
                />

                {errors?.buildType ? <p>{errors?.buildType?.message}</p> : null}
              </div>

              <div>
                <label>{t("STATE")}</label>

                <Controller
                  control={control}
                  name="states"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.states ? "error" : ""}
                      // defaultValue="male"
                      placeholder="Select building type"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={[
                        { value: "1", label: "Alexandria" },
                        { value: "2", label: "Gharbia" },
                        { value: "3", label: "Cairo" },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                        // { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                  )}
                />

                {errors?.states ? <p>{errors?.states?.message}</p> : null}
              </div>

              <div>
                <label>{t("LAND_TYPE")}</label>
                <Controller
                  control={control}
                  name="landType"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter land type"
                      className="placeholder:capitalize"
                      status={errors?.landType ? "error" : ""}
                    />
                  )}
                />

                {errors?.landType ? <p>{errors?.landType?.message}</p> : null}
              </div>

              <div>
                <label>{t("INSECTS")}</label>

                <Controller
                  control={control}
                  name="insects"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.insects ? "error" : ""}
                      // defaultValue="male"
                      placeholder="Insects?"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={[
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                        // { value: "3", label: "villa" },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                        // { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                  )}
                />

                {errors?.insects ? <p>{errors?.insects?.message}</p> : null}
              </div>

              <div>
                <label>{t("RODENTS")}</label>

                <Controller
                  control={control}
                  name="rodents"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.rodents ? "error" : ""}
                      // defaultValue="male"
                      placeholder="rodents?"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={[
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                        // { value: "3", label: "villa" },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                        // { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                  )}
                />

                {errors?.rodents ? <p>{errors?.rodents?.message}</p> : null}
              </div>

              <div>
                <label>{t("TOOLS")}</label>
                <Controller
                  control={control}
                  name="tools"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter Tools"
                      className="placeholder:capitalize"
                      status={errors?.tools ? "error" : ""}
                    />
                  )}
                />

                {errors?.tools ? <p>{errors?.tools?.message}</p> : null}
              </div>

              <div>
                <label>{t("MATERIAL_BY_GM")}</label>
                <Controller
                  control={control}
                  name="materialWeight"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter material weight by gm"
                      className="placeholder:capitalize"
                      status={errors?.materialWeight ? "error" : ""}
                    />
                  )}
                />

                {errors?.materialWeight ? (
                  <p>{errors?.materialWeight?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("NUMBER_OF_WINDOWS")}</label>

                <Controller
                  control={control}
                  name="numberOfWindows"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.numberOfWindows ? "error" : ""}
                      // defaultValue="male"
                      placeholder="number of windows"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={[
                        { value: "1-2", label: "1-2" },
                        { value: "3-6", label: "3-6" },
                        { value: "7+", label: "7+" },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                        // { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                  )}
                />

                {errors?.numberOfWindows ? (
                  <p>{errors?.numberOfWindows?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("NO_WORKERS")}</label>

                <Controller
                  control={control}
                  name="numberOfWorkers"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.numberOfWorkers ? "error" : ""}
                      // defaultValue="male"
                      placeholder="number of workers"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={[
                        { value: "1-2", label: "1-2" },
                        { value: "3-6", label: "3-6" },
                        { value: "7+", label: "7+" },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                        // { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                  )}
                />

                {errors?.numberOfWorkers ? (
                  <p>{errors?.numberOfWorkers?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("BRIDE_CLEANS")}</label>

                <Controller
                  control={control}
                  name="brideClean"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                      variant="filled"
                      status={errors?.brideClean ? "error" : ""}
                      // defaultValue="male"
                      placeholder="Bride cleans up?"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        field.onChange(e);
                        //   handleChange(e);
                      }}
                      options={[
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                        // { value: "3", label: "villa" },
                        // { value: 'Yiminghe', label: 'yiminghe' },
                        // { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                  )}
                />

                {errors?.brideClean ? (
                  <p>{errors?.brideClean?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("VISIT_DURATION")}</label>

                <Controller
                  name="duration"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <TimePicker.RangePicker
                      className="min-h-10 w-full border-[#C4C4C4] border rounded-md capitalize [&>.ant-picker-selector]:capitalize"
                      status={errors?.duration ? "error" : ""}
                      variant="filled"
                      value={
                        field.value
                          ? [
                              field.value[0] ? dayjs(field.value[0]) : null,
                              field.value[1] ? dayjs(field.value[1]) : null,
                            ]
                          : [null, null]
                      }
                      onChange={(values) => {
                        // values is [dayjs | null, dayjs | null]
                        field.onChange(
                          values ? values.map((v) => v?.toISOString()) : null
                        );
                      }}
                    />
                  )}
                />

                {errors?.duration && <p>{errors.duration.message}</p>}
              </div>
            </section> */}

            <section className="extra-services-wrapper">
              <div className="capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
                {t("EXTRA_SERVICE")}
              </div>

              <div className="radio-group capitalize col-span-full">
                <Controller
                  name="extraRoom"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-4">
                      <Radio.Group
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setSelectedRadio(e?.target?.value);
                        }}
                        className="flex flex-col gap-3 extra-room-radio font-semibold"
                      >
                        {extraOptions.map((option, index) => (
                          <div key={option}>
                            <Radio
                              value={index}
                              style={{
                                accentColor: "red",
                              }}
                            >
                              {t(option)}
                            </Radio>

                            {selectedRadio === index && (
                              <div className="flex flex-col gap-1">
                                <Controller
                                  control={control}
                                  name="extraRoomDescription"
                                  rules={{
                                    required: {
                                      value: true,
                                      message: t("REQUIRED"),
                                    },
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      variant="filled"
                                      status={
                                        errors?.extraRoomDescription
                                          ? "error"
                                          : ""
                                      }
                                      placeholder={`Enter ${t(
                                        option
                                      )} description`}
                                      className="mt-2 col-span-full w-full min-h-[70px] border- border-[#C4C4C4] placeholder:capitalize"
                                    />
                                  )}
                                />
                                {errors?.extraRoomDescription ? (
                                  <p className="text-mainRed text-xs mt-1 font-normal">
                                    {errors?.extraRoomDescription?.message}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </div>
                        ))}
                      </Radio.Group>
                    </div>
                  )}
                />
                {errors?.extraRoom ? <p>{errors?.extraRoom?.message}</p> : null}
              </div>

              <div className="col-span-full mt-8">
                <label>{t("GENERAL_COMMENTS")}</label>
                <Controller
                  control={control}
                  name="comments"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter general comments"
                      className="placeholder:capitalize min-h-[70px]"
                      status={errors?.comments ? "error" : ""}
                    />
                  )}
                />

                {errors?.comments ? <p>{errors?.comments?.message}</p> : null}
              </div>
            </section>
          </div>

          <section className="btn-wrapper mt-8 flex items-center justify-between gap-4 [&>div>button]:capitalize [&>div>button]:min-w-[120px] [&>div>button]:py-5 ">
            <div>
              <Button
                variant="outlined"
                className="bg-transparent text-mainColor border-mainColor hover:bg-gray-600/80 hover:border-gray-600/80 hover:text-white transition-colors duration-500"
              >
                {t("BACK")}
              </Button>
            </div>
            <div>
              <Button
                htmlType="submit"
                variant="filled"
                className="bg-mainColor text-white"
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

export default EditReservation;
