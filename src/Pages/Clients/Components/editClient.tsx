import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button, Input, Skeleton } from "antd";
import type {
  APIErrorProps,
  clientFormPropsType,
} from "../../../components/Utilities/Types/types";
import dayjs from "dayjs";
import { FaPlus } from "react-icons/fa";
import {
  useEditClientMutation,
  useGetCustomerByIdQuery,
} from "../../../components/APIs/ClientQuery/CLIENTS_QUERY";
import { toast } from "react-toastify";
import utc from "dayjs/plugin/utc"; // Required for the 'Z' (UTC) output
import AddressRow from "./AddressRow/addressRow";
import { useAppSelector } from "../../../components/APIs/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
dayjs.extend(utc);

const EditClient = () => {
  const { t } = useTranslation();
  const [editClient, { isLoading }] = useEditClientMutation();
  const { lang } = useAppSelector((state) => state?.lang);
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const id = params.get("id");

  // console.log(id);

  const {
    data,
    isLoading: isGetLoading,
    isFetching,
  } = useGetCustomerByIdQuery(
    { id: id! },
    {
      skip: !id,
    }
  );

  const defaultValues = {
    firstName: data?.data.firstName ?? "",
    middleName: data?.data.middleName ?? "",
    lastName: data?.data.lastName ?? "",
    email: data?.data.email ?? "",
    phoneNumber: data?.data.phoneNumber ?? "",
    idNumber: data?.data.idNumber ?? "",
    customerAddresses: data?.data?.address?.map((address) => ({
      cityId: address?.cityId ?? "",
      AreaId: address?.areaId ?? "",
      street: address?.street ?? "",
      apartment: address?.apartment ?? "",
      floor: address?.floor ?? "",
      postalCode: address?.postalCode ?? "",
      landmark: address?.landMark ?? "",
      fullDescription: address?.fullDescription ?? "",
      space: address?.space ?? "",
      BuildingTypeId: address?.buildingTypeId ?? "",
      LandTypeId: address?.landTypeId ?? "",
      insects: address?.insects?.toString() ?? "false",
      rodents: address?.rodents?.toString() ?? "false",
      tools: address?.tools ?? "",
      materialWeight: address?.materialWeight ?? "",
      numberOfWindows: address?.numberOfWindows ?? "",
      numberOfWorkers: address?.numberOfWorkers ?? "",
      brideCleansUp: address?.brideCleansUp?.toString() ?? "false",
      duration: [address?.visitStart, address?.visitEnd],
      visitStart: address?.visitStart ?? "",
      visitEnd: address?.visitEnd ?? "",
    })),
  };
  const {
    control,
    handleSubmit,
    reset,
    // getValues,
    formState: { errors },
  } = useForm<clientFormPropsType>({
    defaultValues: {
      customerAddresses: [],
    },
  });

  // console.log(getValues("customerAddresses"));
  console.log(data?.data?.address?.map((address) => address));

  useEffect(() => {
    if (data?.data) {
      reset(defaultValues);
    }
  }, [data, reset]);

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

  const handleRemoveAddress = (index: number) => {
    remove(index);
  };

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
      // state: "",
      LandTypeId: "",
      insects: "",
      rodents: "",
      tools: "",
      materialWeight: "",
      numberOfWindows: "",
      numberOfWorkers: "",
      brideCleansUp: "",
      duration: ["", ""],
      visitStart: "",
      visitEnd: "",
    });
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
      id: id!,
      customerAddresses: data.customerAddresses.map((address) => ({
        ...address,
        visitStart: address.duration[0],
        visitEnd: address.duration[1],
        rodents: Boolean(address?.rodents),
        insects: Boolean(address?.insects),
        brideCleansUp: Boolean(address?.brideCleansUp),
        // duration: undefined, // Remove the original duration array
      })),
    };

    // console.log(formattedData);

    try {
      await editClient(formattedData).unwrap();
      toast.success("Customer updated successfully");
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
    reset(defaultValues);
  };
  return (
    <>
      {isGetLoading || isFetching ? (
        <Skeleton active paragraph={{ rows: 15 }} />
      ) : (
        <div className="add-client-wrapper">
          <section className="add-client-title-wrapper">
            <Title title={t("EDIT_CLIENT")} subTitle />
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

                  {errors?.firstName ? (
                    <p>{errors?.firstName?.message}</p>
                  ) : null}
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
                      minLength: {
                        value: 7,
                        message: t("MIN_LENGTH", { length: 7 }),
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
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: t("ONLY_NUMBER"),
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
                </div>

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
                  {t("UPDATE")}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default EditClient;
