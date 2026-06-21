import { Controller, useForm } from "react-hook-form";
import type { APIErrorProps, serviceFormProps } from "../../../components/Utilities/Types/types";
import Title from "../../../components/Common/Title/title";
import { useTranslation } from "react-i18next";
import { Button, Input, Select, Skeleton } from "antd";
import {
  useAddServiceMutation,
  useEditServiceMutation,
  useGetServiceByIdQuery,
} from "../../../components/APIs/Services/SERVICES_QUERY";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { useGetAllPackagesQuery } from "../../../components/APIs/Packages/PACKAGES_QUERY";
import Astrisk from "../../../components/Common/Astrisk/astrisk";

// const extraOptions = [
//   "CLEANING_RESIDENTIAL",
//   "CLEANING_ADMINISTRATIVE",
//   "CLEANING_VILLAS_CHALETS",
//   "CLEANING_POST_FINISHING",
//   "DISINFECTION_STERILIZATION",
//   "BRIDAL_HOME_SETUP",
//   "DRY_CLEANING",
// ];

const ServiceForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id");

    const { data: packages, isLoading: packagesLoading, isFetching: packagesFetching } = useGetAllPackagesQuery();

  const {
    data: service,
    isLoading: serviceLoading,
    isFetching: serviceFetching,
    isSuccess: serviceSuccess,
  } = useGetServiceByIdQuery(id ? { id } : skipToken);
  const [addService, { isLoading: isAddLoading }] =
    useAddServiceMutation();
  const [editService, { isLoading: isEditLoading }] =
    useEditServiceMutation();

  const defaultValues = {
    id : service?.data?.id || null,
    title: service?.data?.title,
    arTitle: service?.data?.arTitle,
    description: service?.data?.description,
    packages: service?.data?.packages,
    // isActive:service?.data?.isActive,
    // extraServices: service?.data?.extraServices,
  };  
  const {
    control,
    formState: { errors },
    handleSubmit,
    // setValue,
    reset,
  } = useForm<serviceFormProps>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (service?.data && id && serviceSuccess) {
      reset(defaultValues);
    }
  }, [service, reset, id, serviceSuccess]);

  const handleFormSubmit = async (data: serviceFormProps) => {
    try {
      if (id) {
        await editService(data).unwrap();
        toast.success(t("SERVICE_EDITED_SUCCESS"));
          navigate("/services");
      } else {
        await addService(data).unwrap();
        toast.success(t("SERVICE_ADDED_SUCCESS"));
          navigate("/services");
      }
    } catch (error) {
      if (error) {
        const err = error as APIErrorProps;
        err?.data?.errorMessages?.forEach((message) => {
          toast.error(message);
        });
      } else {
        toast.error(id ? t("SERVICE_EDIT_FAILED") : t("SERVICE_ADD_FAILED"));
      }
    }

    
  };
  return (
    <>
      {id && (serviceLoading || serviceFetching) ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <main>
          <header>
            <Title title={t(id ? "EDIT_SERVICE" : "ADD_SERVICE")} subTitle />
          </header>

          <article className="service-form-wrapper mt-8">
            <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
                <div>
                  <label>{t("TITLE")} <Astrisk /></label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                      pattern: {
                    value: /^[a-zA-Z0-9\s]+$/,
                    message: t("ENGLISH_LETTER"),
                  },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        variant="filled"
                        placeholder={t("ENTER_TITLE_EN")}
                        className="placeholder:capitalize"
                        status={errors?.title ? "error" : ""}
                      />
                    )}
                  />
                  {errors?.title ? <p>{errors?.title?.message}</p> : null}
                </div>

                <div>
                  <label>{t("AR_TITLE")} <Astrisk /></label>
                  <Controller
                    name="arTitle"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                      pattern: {
                    value: /^[\u0600-\u06FF0-9\s]+$/,
                    message: t("ARABIC_LETTER"),
                  },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        variant="filled"
                        placeholder={t("ENTER_TITLE_AR")}
                        className="placeholder:capitalize"
                        status={errors?.arTitle ? "error" : ""}
                      />
                    )}
                  />
                  {errors?.arTitle ? <p>{errors?.arTitle?.message}</p> : null}
                </div>

                <div className="md:col-span-full">
                  <label>{t("SELECT_PACKAGE")} <Astrisk /></label>
                  <Controller
                    control={control}
                    name="packages"
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        size="large"
                        className=" max-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                        variant="filled"
                        status={errors?.packages ? "error" : ""}
                        loading={packagesLoading || packagesFetching}
                        // defaultValue="male"
                        style={{ width: "100%" }}
                        placeholder={t("PLEASE_SELECT_PACKAGE")}
                        value={field.value?.map((item) => item?.packageId)}
                        onChange={(ids) => {
                          field.onChange(
                            ids?.map((packageId: string | number) => ({
                              packageId,
                            })),
                          );
                        }}
                        options={packages?.data?.map((item) => ({
                          value: item.id,
                          label: item.title,
                        }))}
                      />
                    )}
                  />

                  {errors?.packages ? <p>{errors?.packages?.message}</p> : null}
                </div>

                <div className="col-span-full">
                  <label>{t("DESCRIPTION")} <Astrisk /></label>
                  <Controller
                    name="description"
                    control={control}
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
                        placeholder={t("ENTER_DESCRIPTION")}
                        className="placeholder:capitalize min-h-[80px]"
                        status={errors?.description ? "error" : ""}
                      />
                    )}
                  />
                  {errors?.description ? (
                    <p>{errors?.description?.message}</p>
                  ) : null}
                </div>

                {/* <div className="col-span-full">
                  <label>{t("EXTRA_SERVICE")}</label>

                  <Controller
                    name="extraServices"
                    control={control}
                    defaultValue={[]}
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                    }}
                    render={({ field }) => (
                      <div className="flex flex-col gap-4">
                        <Checkbox.Group
                          value={field.value || []}
                          onChange={(checkedValues) => {
                            field.onChange(checkedValues);

                            if (checkedValues.length === 0) {
                              setValue("extraServices", null);
                            }
                          }}
                          className="flex flex-col gap-3 font-semibold"
                        >
                          {extraOptions.map((option, index) => (
                            <Checkbox
                              key={index}
                              value={index}
                              style={{ accentColor: "red" }}
                            >
                              {t(option)}
                            </Checkbox>
                          ))}
                        </Checkbox.Group>

                      </div>
                    )}
                  />

                  {errors?.extraServices ? (
                    <p>{errors?.extraServices?.message}</p>
                  ) : null}
                </div> */}
              </section>

              <section className="submit-btn-wrapper mt-8 w-full flex justify-center">
                <Button
                  htmlType="submit"
                  className="bg-mainColor text-white py-5 min-w-[200px] capitalize"
                  loading={isAddLoading || isEditLoading}
                >
                  {t(id ? "UPDATE" : "SUBMIT")}
                </Button>
              </section>
            </form>
          </article>
        </main>
      )}
    </>
  );
};

export default ServiceForm;
