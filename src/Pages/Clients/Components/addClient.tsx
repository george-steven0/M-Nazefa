import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  Input,
  Select,
  Space,
  type CheckboxProps,
} from "antd";
import type {
  APIErrorProps,
  clientFormPropsType,
} from "../../../components/Utilities/Types/types";
import dayjs from "dayjs";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useAddNewClientMutation } from "../../../components/APIs/ClientQuery/CLIENTS_QUERY";
import { toast } from "react-toastify";
import utc from "dayjs/plugin/utc"; // Required for the 'Z' (UTC) output
import AddressRow from "./AddressRow/addressRow";
import { useAppSelector } from "../../../components/APIs/store";
import { useNavigate } from "react-router-dom";
import { useGetCustomerTypesQuery } from "../../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import Astrisk from "../../../components/Common/Astrisk/astrisk";
dayjs.extend(utc);

const AddClient = () => {
  const { t } = useTranslation();
  const [addNewClient, { isLoading }] = useAddNewClientMutation();
  const { lang } = useAppSelector((state) => state?.lang);
  const navigate = useNavigate();
  const [isMembership, setIsMembership] = useState(false);

  const {
    data: customerTypes,
    isLoading: isCustomerTypesLoading,
    isFetching: isCustomerTypesFetching,
  } = useGetCustomerTypesQuery();

  // console.log(customerTypes);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<clientFormPropsType>({
    defaultValues: {
      customerAddresses: [
        {
          cityId: "",
          AreaId: "",
          street: "",
          apartment: "",
          floor: "",
          postalCode: "",
          landmark: "",
          fullDescription: "",
        },
      ],
      phoneNumbers: [
        {
          phoneNumber: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "customerAddresses",
    control: control,
    rules: {
      required: {
        value: true,
        message: t("REQUIRED"),
      },
    },
  });

  const handleAddAddress = () => {
    append({
      cityId: "",
      AreaId: "",
      street: "",
      apartment: "",
      floor: "",
      postalCode: "",
      landmark: "",
      fullDescription: "",
      space: "",
      BuildingTypeId: "",
      LandTypeId: "",
      numberOfWindows: "",
      numberOfBathrooms: "",
      numberOfBedrooms: "",
      numberOfKitchens: "",
      numberOfLivingRooms: "",
      numberOfReceptionrooms: "",
      hasPets: false,
      landLine: "",
    });
  };

  const handleRemoveAddress = (index: number) => {
    remove(index);
  };

  const {
    fields: phones,
    append: addPhone,
    remove: removePhone,
  } = useFieldArray({
    name: "phoneNumbers",
    control: control,
    rules: {
      required: {
        value: true,
        message: t("REQUIRED"),
      },
    },
  });

  const handleAddPhone = () => {
    addPhone({
      phoneNumber: "",
    });
  };

  const handleRemovePhone = (index: number) => {
    removePhone(index);
  };

  const handleFormSubmit = async (data: clientFormPropsType) => {
    // const formData = new FormData();
    // await Object.entries(data).forEach(([key, value]) => {
    //   // Handle different types of values
    //   if (Array.isArray(value)) {
    //     value.forEach((v) => formData.append(key, v));
    //   } else if (value !== undefined && value !== null) {
    //     formData.append(key, String(value));
    //   }
    // });
    // console.log(data);
    const formattedData = {
      ...data,
      customerAddresses: data.customerAddresses.map((address) => ({
        ...address,
        // visitStart: address?.duration?.[0] || "",
        // visitEnd: address?.duration?.[1] || "",
        // rodents: address.rodents === "true",
        // insects: address.insects === "true",
        // brideCleansUp: address.brideCleansUp === "true",
        // duration: undefined,
      })),
    };

    // console.log(formattedData);

    try {
      await addNewClient(formattedData).unwrap();
      toast.success("Customer added successfully");
      navigate("/clients");
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
      // console.log(err?.data);
    }
  };

  const resetForm = () => {
    reset();
  };

  const membershipChange: CheckboxProps["onChange"] = (e) => {
    setIsMembership(e.target.checked);
    // console.log(e.target.checked);
    if (!e.target.checked) {
      setValue("membership", "");
    }
  };

  return (
    <div className="add-client-wrapper">
      <section className="add-client-title-wrapper">
        <Title title={t("ADD_CLIENT")} subTitle />
      </section>

      <section className="mt-8 form-wrapper">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-wrap flex-col gap-10 [&>section]:grid [&>section]:grid-cols-1 [&>section]:md:grid-cols-2 [&>section]:lg:grid-cols-3 [&>section]:gap-5 [&>section>div>label]:block [&>section>div>label]:mb-1 [&>section>div>label]:capitalize [&>section>div>label]:font-medium [&>section>div>input]:border-[#C4C4C4] [&>section>div>input]:py-2 [&>section>div>p]:mt-1 [&>section>div>p]:text-xs [&>section>div>p]:capitalize [&>section>div>p]:text-mainRed"
          noValidate
        >
          <section className="personal-info-section">
            <article className="personal-title capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
              {t("PERSONAL_INFO")}
            </article>

            <div>
              <label>
                {t("FIRST_NAME")}
                <Astrisk />
              </label>
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
              <label>
                {t("MIDDLE_NAME")}
                <Astrisk />
              </label>
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

              {errors?.middleName ? <p>{errors?.middleName?.message}</p> : null}
            </div>

            <div>
              <label>
                {t("LAST_NAME")}
                <Astrisk />
              </label>
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
              <label>
                {t("ID_NUMBER")}
                {/* <Astrisk /> */}
              </label>
              <Controller
                control={control}
                name="idNumber"
                rules={{
                  // required: {
                  //   value: true,
                  //   message: t("REQUIRED"),
                  // },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: t("ONLY_NUMBER"),
                  },
                  minLength: {
                    value: 14,
                    message: t("MIN_LENGTH", { length: 14 }),
                  },
                  maxLength: {
                    value: 14,
                    message: t("MAX_LENGTH", { length: 14 }),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter id number"
                    className="placeholder:capitalize"
                    status={errors?.idNumber ? "error" : ""}
                    maxLength={14}
                    minLength={14}
                  />
                )}
              />

              {errors?.idNumber ? <p>{errors?.idNumber?.message}</p> : null}
            </div>

            <div>
              <label>
                {t("EMAIL")}
                {/* <Astrisk /> */}
              </label>
              <Controller
                control={control}
                name="email"
                rules={{
                  // required: {
                  //   value: true,
                  //   message: t("REQUIRED"),
                  // },
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

            <div>
              <label>
                {t("CUSTOMER_TYPE")}
                <Astrisk />
              </label>
              <Controller
                control={control}
                name={`CustomerTypeId`}
                rules={{
                  required: { value: true, message: t("REQUIRED") },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                    placeholder="Select customer type"
                    variant="filled"
                    status={errors?.CustomerTypeId ? "error" : ""}
                    loading={isCustomerTypesLoading || isCustomerTypesFetching}
                    options={customerTypes?.data?.map((customerType) => ({
                      value: customerType.id,
                      label:
                        lang === "ar" ? customerType.arName : customerType.name,
                    }))}
                  />
                )}
              />
              {errors?.CustomerTypeId && (
                <p>{errors?.CustomerTypeId?.message}</p>
              )}
            </div>

            <div className="col-span-full grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 justify-start">
              <div className="flex flex-col w-fit">
                <label className="cursor-pointer w-fit" htmlFor="hasMembership">
                  {t("HAS_MEMBERSHIP")}
                  {/* <Astrisk /> */}
                </label>

                <Controller
                  control={control}
                  name="hasMembership"
                  // rules={{
                  //   required: { value: true, message: t("REQUIRED") },
                  // }}
                  render={({ field }) => (
                    <Checkbox
                      id="hasMembership"
                      {...field}
                      className="size-fit scale-125"
                      // status={errors?.hasMembership ? "error" : ""}
                      checked={!!field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        membershipChange(e);
                      }}
                    />
                  )}
                />
                {errors?.hasMembership && (
                  <p className="text-red-500 text-xs mt-1 capitalize">
                    {errors?.hasMembership?.message}
                  </p>
                )}
              </div>

              {isMembership ? (
                <div className="flex flex-col col-span-2">
                  <label
                    className="w-fit"
                    // htmlFor="hasMembership"
                  >
                    {t("MEMBERSHIP_ID")}
                    <Astrisk />
                  </label>

                  <Controller
                    control={control}
                    name="membership"
                    rules={{
                      required: { value: isMembership, message: t("REQUIRED") },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        variant="filled"
                        placeholder="Enter membership id"
                        className="placeholder:capitalize border-[#C4C4C4] border rounded-md py-2 min-w-[250px]"
                        status={errors?.membership ? "error" : ""}
                      />
                    )}
                  />
                  {errors?.membership && (
                    <p className="text-red-500 text-xs mt-1 capitalize">
                      {errors?.membership?.message}
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="col-span-full flex flex-col gap-2">
              <div className="flex items-center gap-2 capitalize">
                <label>{t("PHONE_NUMBER")}</label>
                <Astrisk />
                <Button
                  shape="circle"
                  size="small"
                  className="bg-green-600/20 text-green-600 border-none"
                  icon={<FaPlus size={12} />}
                  onClick={handleAddPhone}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {phones?.map((phone, index) => (
                  <div key={phone?.id}>
                    <Controller
                      control={control}
                      name={`phoneNumbers.${index}.phoneNumber`}
                      rules={{
                        required: { value: true, message: t("REQUIRED") },
                        pattern: {
                          value: /^\d{1,14}$/,
                          message: t("ONLY_NUMBER"),
                        },
                        minLength: {
                          value: 11,
                          message: t("MIN_LENGTH", { length: 11 }),
                        },
                      }}
                      render={({ field }) => (
                        <Space.Compact className="items-stretch w-full">
                          <Input
                            {...field}
                            variant="filled"
                            placeholder="Enter phone number"
                            className={`placeholder:capitalize border-[#C4C4C4] border ${
                              phones?.length > 1 ? "rounded-s-md" : "rounded-md"
                            } py-2 min-w-[250px]`}
                            status={
                              errors?.phoneNumbers?.[index]?.phoneNumber
                                ? "error"
                                : ""
                            }
                          />

                          <span>
                            {phones?.length > 1 ? (
                              <Button
                                icon={<FaMinus className="text-sm" />}
                                onClick={() => handleRemovePhone(index)}
                                className="bg-red-500 text-white border-none size-full min-w-[30px] rounded-e-md"
                                shape="default"
                              />
                            ) : null}
                          </span>
                        </Space.Compact>
                      )}
                    />
                    {errors?.phoneNumbers?.[index]?.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1 capitalize">
                        {errors?.phoneNumbers?.[index]?.phoneNumber?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-full">
              <label>{t("GENERAL_NOTES")}</label>
              <Controller
                control={control}
                name={`generalNotes`}
                // rules={{
                //   required: { value: true, message: t("REQUIRED") },
                // }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    variant="filled"
                    placeholder="Enter general notes"
                    className="placeholder:capitalize border-[#C4C4C4] border rounded-md py-2 min-h-[70px] resize-none"
                    status={errors?.generalNotes ? "error" : ""}
                  />
                )}
              />
              {errors?.generalNotes && <p>{errors?.generalNotes?.message}</p>}
            </div>
          </section>

          <div className="col-span-full">
            <article className="personal-title flex items-center gap-4 mb-4 capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
              {t("ADDRESSES")}
              <Button
                icon={<FaPlus />}
                onClick={handleAddAddress}
                className="bg-green-600 text-white border-none"
                shape="circle"
              />
            </article>

            <div className="flex flex-col gap-5">
              {fields?.map((address, index) => (
                <div
                  key={address.id}
                  className="flex flex-wrap flex-col gap-10 [&>section]:grid [&>section]:grid-cols-1 [&>section]:md:grid-cols-2 [&>section]:lg:grid-cols-3 [&>section]:gap-5 [&>section>div>label]:block [&>section>div>label]:mb-1 [&>section>div>label]:capitalize [&>section>div>label]:font-medium [&>section>div>input]:border-[#C4C4C4] [&>section>div>input]:py-2 [&>section>div>select]:border-[#C4C4C4] [&>section>div>select]:py-2 [&>section>div>select]:w-full [&>section>div>p]:mt-1 [&>section>div>p]:text-xs [&>section>div>p]:capitalize [&>section>div>p]:text-mainRed"
                >
                  <AddressRow
                    lang={lang}
                    index={index}
                    control={control}
                    errors={errors}
                    handleRemoveAddress={handleRemoveAddress}
                    length={fields?.length}
                    t={t}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="basis-full w-full flex items-center justify-center gap-5 [&>button]:min-w-[180px]">
            <Button
              className="bg-lightGray text-black hover:bg-gray-300"
              onClick={resetForm}
            >
              {t("RESET")}
            </Button>
            <Button
              htmlType="submit"
              variant="outlined"
              loading={isLoading}
              className="w-fit min-w-40 py-4 capitalize border border-mainColor/20 bg-transparent text-mainColor hover:bg-mainColor hover:text-white"
            >
              {t("SUBMIT")}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddClient;
