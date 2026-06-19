import { BiPlus, BiTrash } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ImgCrop from "antd-img-crop";
import {
  Button,
  Image,
  Input,
  Select,
  Skeleton,
  Upload,
  type UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import type {
  APIErrorProps,
  FileType,
  packageFormProps,
} from "../../../components/Utilities/Types/types";
import { getBase64 } from "../../../components/Utilities/helper";
import {
  useAddPackageMutation,
  useEditPackageMutation,
  useGetPackageByIdQuery,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPackageTypesQuery } from "../../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import { useAppSelector } from "../../../components/APIs/store";
import { useGetCleaningAreasQuery } from "../../../components/APIs/CleaningArea/CLEANING_AREA_QUERY";
import Astrisk from "../../../components/Common/Astrisk/astrisk";

export default function PackageForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useAppSelector((state) => state?.lang);

  const {
    data: packageTypes,
    isLoading: isPackageTypesLoading,
    isFetching: isPackageTypesFetching,
  } = useGetPackageTypesQuery();

  const {
    data: cleaningAreas,
    isLoading: isCleaningAreasLoading,
    isFetching: isCleaningAreasFetching,
  } = useGetCleaningAreasQuery();

  // const {
  //   data: extraServices,
  //   isLoading: isExtraServicesLoading,
  //   isFetching: isExtraServicesFetching,
  // } = useGetExtraServiceQuery();

  const [addPackage, { isLoading: isAddPackageLoading }] =
    useAddPackageMutation();

  const [editPackage, { isLoading: isEditPackageLoading }] =
    useEditPackageMutation();

  const [params] = useSearchParams();
  const id = params.get("id");

  const {
    data: packageById,
    isLoading,
    isFetching,
  } = useGetPackageByIdQuery(id ? { id } : skipToken);

  // console.log(packageById?.data);

  const defaultValues = {
    packageTypeId: packageById?.data?.packageTypeId,
    Title: packageById?.data?.title,
    ArTitle: packageById?.data?.arTitle,
    ArSubTitle: packageById?.data?.arSubTitle,
    SubTitle: packageById?.data?.subTitle,
    Description: packageById?.data?.description,
    IsPercentage: String(packageById?.data?.isPercentage),
    Discount: packageById?.data?.discount,
    Logo: packageById?.data?.logo,
    Rules: packageById?.data?.rules?.map((rule) => ({ value: rule })),
    Supplies: packageById?.data?.supplies?.map((supply) => ({ value: supply })),
    Tools: packageById?.data?.tools?.map((tool) => ({ value: tool })),
    NumberofRooms: packageById?.data?.numberOfRooms,
    NumberofWorkers: packageById?.data?.numberOfWorkers,
    Price: packageById?.data?.price,
    CleaningAreaDetails: packageById?.data?.cleaningAreaDetails?.map(
      (cleaningArea) => ({
        CleaningAreaId: cleaningArea.cleaningAreaId,
        ArName: cleaningArea.arName,
        Name: cleaningArea.name,
        Description: cleaningArea.description,
      }),
    ),
    ExtraServices: packageById?.data?.extraServices?.map((extraService) => ({
      ArName: extraService.arName,
      Name: extraService.name,
      Price: extraService.price,
    })),
    // TransportationFees: packageById?.data?.transportationFees?.map((trans) => ({
    //   Fee: trans.fee,
    //   CityId: trans.cityId,
    // })),
  } as unknown as packageFormProps;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,

    formState: { errors },
  } = useForm<packageFormProps>({
    defaultValues: id
      ? defaultValues
      : {
          packageTypeId: "",
          Title: "",
          ArTitle: "",
          ArSubTitle: "",
          SubTitle: "",
          Description: "",
          Logo: "",
          Rules: [{ value: "" }],
          Supplies: [{ value: "" }],
          Tools: [{ value: "" }],
          NumberofRooms: "",
          NumberofWorkers: "",
          Price: "",
          CleaningAreaDetails: [
            {
              CleaningAreaId: "",
              ArName: "",
              Name: "",
              Description: "",
            },
          ],
          ExtraServices: [
            {
              ArName: "",
              Name: "",
              Price: "",
            },
          ],
          // TransportationFees: [
          //   {
          //     Fee: "",
          //     CityId: "",
          //   },
          // ],
        },
  });

  // console.log(errors);

  useEffect(() => {
    if (id && packageById?.isSuccess && packageById?.data) {
      reset(defaultValues);
      setFileList([
        {
          uid: "-1", // unique id
          name: "logo.png",
          status: "done",
          url: packageById?.data?.logo, // This shows the image in the UI
        },
      ]);
    }
  }, [reset, id, packageById?.isSuccess, packageById?.data]);

  /* File Input */
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  /* File Input */

  //   const {
  //     fields: transportaionFields,
  //     append: transportaionAppend,
  //     remove: transportaionRemove,
  //   } = useFieldArray({
  //     name: "TransportationFees",
  //     control,
  //     rules: {
  //       required: {
  //         value: true,
  //         message: t("REQUIRED"),
  //       },
  //     },
  //   });

  //   const addMoreTransportation = () => {
  //     transportaionAppend({
  //       Fee: "",
  //       CityId: "",
  //     });
  //   };

  //   const removeTransportation = (index: number) => {
  //     transportaionRemove(index);
  //   };

  // Cleaning Area Array
  const {
    fields: cleaningAreaFields,
    append: cleaningAreaAppend,
    remove: cleaningAreaRemove,
  } = useFieldArray({
    name: "CleaningAreaDetails",
    control,
    rules: {
      required: {
        value: true,
        message: t("REQUIRED"),
      },
    },
  });

  const addMoreCleaningArea = () => {
    cleaningAreaAppend({
      CleaningAreaId: "",
      ArName: "",
      Name: "",
      Description: "",
    });
  };

  const removeCleaningArea = (index: number) => {
    cleaningAreaRemove(index);
  };

  //Extra Services

  const {
    fields: extraServicesFields,
    append: extraServicesAppend,
    remove: extraServicesRemove,
  } = useFieldArray({
    name: "ExtraServices",
    control,
    rules: {
      required: {
        value: true,
        message: t("REQUIRED"),
      },
    },
  });

  const addMoreExtraServices = () => {
    extraServicesAppend({
      ArName: "",
      Name: "",
      Price: 0,
    });
  };

  const removeExtraServices = (index: number) => {
    extraServicesRemove(index);
  };

  // Tools
  const {
    fields: toolsFields,
    append: toolsAppend,
    remove: toolsRemove,
  } = useFieldArray({
    name: "Tools",
    control,
  });

  const addMoreTools = () => {
    toolsAppend({ value: "" });
  };

  const removeTools = (index: number) => {
    toolsRemove(index);
  };

  // Supplies
  const {
    fields: suppliesFields,
    append: suppliesAppend,
    remove: suppliesRemove,
  } = useFieldArray({
    name: "Supplies",
    control,
  });

  const addMoreSupplies = () => {
    suppliesAppend({ value: "" });
  };

  const removeSupplies = (index: number) => {
    suppliesRemove(index);
  };

  // Rules
  const {
    fields: rulesFields,
    append: rulesAppend,
    remove: rulesRemove,
  } = useFieldArray({
    name: "Rules",
    control,
  });

  const addMoreRules = () => {
    rulesAppend({ value: "" });
  };

  const removeRules = (index: number) => {
    rulesRemove(index);
  };

  const handleSubmitForm = async (data: packageFormProps) => {
    // console.log(data);
    const formattedData = new FormData();
    if (id) {
      formattedData.append("id", id as string);
    }

    // Convert Tools/Supplies/Rules from [{ value }] to flat array of strings
    const payload = {
      ...data,
      Tools: data.Tools?.map((item) => item.value),
      Supplies: data.Supplies?.map((item) => item.value),
      Rules: data.Rules?.map((item) => item.value),
    };

    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        // Handle Arrays (PackageDetails, TransportationFees)
        value.forEach((item, index) => {
          if (typeof item === "object" && !(item instanceof File)) {
            // Loop through the sub-keys of the object
            // Result: key[index].subKey -> PackageDetails[0].NumberofRooms
            Object.entries(item).forEach(([subKey, subValue]) => {
              formattedData.append(
                `${key}[${index}].${subKey}`,
                String(subValue),
              );
            });
          } else {
            // Handle arrays of primitives or files
            formattedData.append(`${key}[${index}]`, item);
          }
        });
      } else if (value instanceof File) {
        formattedData.append(key, value);
      } else if (typeof value === "object") {
        // Handle single non-file objects if any exist
        Object.entries(value).forEach(([subKey, subValue]) => {
          formattedData.append(`${key}.${subKey}`, String(subValue));
        });
      } else {
        // Handle primitives
        formattedData.append(key, String(value));
      }
    });

    // console.log(Object.fromEntries(formattedData));

    try {
      if (id) {
        await editPackage(formattedData).unwrap();
        toast.success("Package updated successfully", {
          toastId: "package-updated",
        });
      } else {
        await addPackage(formattedData).unwrap();
        toast.success("Package added successfully", {
          toastId: "package-added",
        });
      }
      navigate("/packages");
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message, {
          toastId: "package-error",
        });
      });
      // console.log(err?.data);
    }
  };

  const isPercentage = watch("IsPercentage");

  // useEffect(() => {
  //   if (dirtyFields.discountTypeId) {
  //     trigger("Discount");
  //   }
  // }, [discountTypeId, trigger, dirtyFields]);

  return (
    <>
      {isLoading || isFetching ? (
        <Skeleton active paragraph={{ rows: 15 }} />
      ) : (
        <div className="add-package-wrapper">
          <section className="packages-title-wrapper">
            {id ? (
              <Title title={t("EDIT_PACKAGE")} subTitle />
            ) : (
              <Title title={t("ADD_PACKAGE")} subTitle />
            )}
          </section>

          <form
            noValidate
            onSubmit={handleSubmit(handleSubmitForm)}
            className="mt-12"
          >
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
              <div className="image col-span-full text-center w-full flex flex-col justify-center items-center gap-1">
                <Controller
                  control={control}
                  name="Logo"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <ImgCrop rotationSlider>
                        <Upload
                          {...field}
                          listType="picture-circle"
                          fileList={fileList}
                          onChange={({ file, fileList }) => {
                            setFileList(fileList); // took fielist because it must take an array of files

                            if (file) {
                              field.onChange(file);
                            }
                          }}
                          onPreview={handlePreview}
                          beforeUpload={() => false}
                          maxCount={1}
                        >
                          {fileList.length < 1 && "+ Upload"}
                        </Upload>
                      </ImgCrop>

                      {previewImage && (
                        <Image
                          wrapperStyle={{ display: "none" }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(""),
                          }}
                          src={previewImage}
                        />
                      )}
                    </>
                  )}
                />

                {errors?.Logo ? <p>{errors?.Logo?.message}</p> : null}
              </div>

              <div className="col-span-full">
                <label>
                  {t("PACKAGE_TYPE")} <Astrisk />
                </label>
                <Controller
                  control={control}
                  name="packageTypeId"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant="filled"
                      placeholder={t("SELECT_PACKAGE_TYPE")}
                      className="w-full border border-[#C4C4C4] rounded-md h-10"
                      status={errors?.packageTypeId ? "error" : ""}
                      loading={isPackageTypesLoading || isPackageTypesFetching}
                      options={packageTypes?.data?.map((item) => ({
                        label: lang === "ar" ? item.arName : item.name,
                        value: item.id,
                      }))}
                      showSearch
                      optionFilterProp="label"
                    />
                  )}
                />

                {errors?.packageTypeId ? (
                  <p>{errors?.packageTypeId?.message}</p>
                ) : null}
              </div>

              <div>
                <label>
                  {t("TITLE")} <Astrisk />
                </label>
                <Controller
                  control={control}
                  name="Title"
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
                      placeholder="Enter english title"
                      className="placeholder:capitalize"
                      status={errors?.Title ? "error" : ""}
                    />
                  )}
                />

                {errors?.Title ? <p>{errors?.Title?.message}</p> : null}
              </div>

              <div>
                <label>
                  {t("AR_TITLE")} <Astrisk />
                </label>
                <Controller
                  control={control}
                  name="ArTitle"
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
                      placeholder="Enter arabic title"
                      className="placeholder:capitalize"
                      status={errors?.ArTitle ? "error" : ""}
                    />
                  )}
                />

                {errors?.ArTitle ? <p>{errors?.ArTitle?.message}</p> : null}
              </div>

              <div>
                <label>
                  {t("SUB_TITLE")} <Astrisk />
                </label>
                <Controller
                  control={control}
                  name="SubTitle"
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
                      placeholder="Enter english sub title"
                      className="placeholder:capitalize"
                      status={errors?.SubTitle ? "error" : ""}
                    />
                  )}
                />

                {errors?.SubTitle ? <p>{errors?.SubTitle?.message}</p> : null}
              </div>

              <div>
                <label>
                  {t("AR_SUB_TITLE")} <Astrisk />
                </label>
                <Controller
                  control={control}
                  name="ArSubTitle"
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
                      placeholder="Enter arabic sub title"
                      className="placeholder:capitalize"
                      status={errors?.ArSubTitle ? "error" : ""}
                    />
                  )}
                />

                {errors?.ArSubTitle ? (
                  <p>{errors?.ArSubTitle?.message}</p>
                ) : null}
              </div>

              <div className="col-span-full">
                <label>
                  {t("DESCRIPTION")} <Astrisk />
                </label>
                <Controller
                  control={control}
                  name="Description"
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
                      status={errors?.Description ? "error" : ""}
                    />
                  )}
                />

                {errors?.Description ? (
                  <p>{errors?.Description?.message}</p>
                ) : null}
              </div>

              <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-5 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
                <div>
                  <label>
                    {t("NUMBER_OF_ROOMS")} <Astrisk />
                  </label>

                  <Controller
                    control={control}
                    name={`NumberofRooms`}
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                        placeholder="Number of rooms"
                        variant="filled"
                        status={errors?.NumberofRooms ? "error" : ""}
                        options={Array.from({ length: 21 })?.map(
                          (_, index) => ({
                            label: index,
                            value: index,
                          }),
                        )}
                      />
                    )}
                  />
                  {errors?.NumberofRooms && (
                    <p>{errors.NumberofRooms.message}</p>
                  )}
                </div>

                <div>
                  <label>
                    {t("NO_WORKERS")} <Astrisk />
                  </label>

                  <Controller
                    control={control}
                    name={`NumberofWorkers`}
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                        placeholder="Number of workers"
                        variant="filled"
                        status={errors?.NumberofWorkers ? "error" : ""}
                        options={Array.from({ length: 21 })?.map(
                          (_, index) => ({
                            label: index + 1,
                            value: index + 1,
                          }),
                        )}
                      />
                    )}
                  />
                  {errors?.NumberofWorkers && (
                    <p>{errors.NumberofWorkers.message}</p>
                  )}
                </div>

                <div>
                  <label>
                    {t("PRICE")} <Astrisk />
                  </label>

                  <Controller
                    control={control}
                    name={`Price`}
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                      pattern: {
                        value: /^\d+$/,
                        message: t("ONLY_NUMBER"),
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        variant="filled"
                        placeholder="Enter Price"
                        className="placeholder:capitalize"
                        status={errors?.Price ? "error" : ""}
                      />
                    )}
                  />

                  {errors?.Price ? <p>{errors?.Price?.message}</p> : null}
                </div>
              </div>

              <div className="discount-wrapper col-span-full grid grid-cols-1 md:grid-cols-2 gap-5 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
                <div>
                  <label>
                    {t("DISCOUNT_TYPE")} <Astrisk />
                  </label>
                  <Controller
                    control={control}
                    name="IsPercentage"
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        variant="filled"
                        placeholder={t("SELECT_DISCOUNT_TYPE")}
                        className="w-full border border-[#C4C4C4] rounded-md h-10"
                        onChange={(value) => {
                          field.onChange(value);
                          trigger("Discount");
                        }}
                        options={[
                          {
                            id: 1,
                            label: t("PERCENTAGE"),
                            value: "true",
                          },
                          { id: 2, label: t("AMOUNT"), value: "false" },
                        ]}
                        status={errors?.IsPercentage ? "error" : ""}
                      />
                    )}
                  />

                  {errors?.IsPercentage ? (
                    <p>{errors?.IsPercentage?.message}</p>
                  ) : null}
                </div>

                <div>
                  <label>
                    {t("DISCOUNT_VALUE")} <Astrisk />
                  </label>
                  <Controller
                    control={control}
                    name="Discount"
                    rules={{
                      required: {
                        value: true,
                        message: t("REQUIRED"),
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: t("ONLY_NUMBER"),
                      },
                      validate: (value) => {
                        if (isPercentage === "true" && Number(value) > 100) {
                          return t("VALUE_LIMIT", { value: 100 });
                        }
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        variant="filled"
                        placeholder="Enter discount value"
                        className="placeholder:capitalize"
                        status={errors?.Discount ? "error" : ""}
                        onBlur={() => trigger("Discount")}
                      />
                    )}
                  />

                  {errors?.Discount ? <p>{errors?.Discount?.message}</p> : null}
                </div>
              </div>

              {/* <div className="transportation-fees-wrapper col-span-full grid grid-cols-1">
                <div className="col-span-full flex items-center gap-2">
                  <label className="font-medium text-lg">
                    {t("TRANSPORTATION_FEES")}
                  </label>
                  <Button
                    type="default"
                    onClick={addMoreTransportation}
                    className="bg-green-700 text-white capitalize rounded-full"
                    icon={<FaPlus size={13} />}
                    size="small"
                  />
                </div>
                {transportaionFields?.map((field, index) => (
                  <section
                    className="my-3 flex items-center gap-5 [&>div]:grow [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed"
                    key={field?.id || index}
                  >
                    <div className="basis-1/4">
                      <label>{t("CITY")}</label>

                      <Controller
                        control={control}
                        name={`TransportationFees.${index}.CityId`}
                        rules={{
                          required: {
                            value: true,
                            message: t("REQUIRED"),
                          },
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                            placeholder="Select Country"
                            variant="filled"
                            status={
                              errors?.TransportationFees?.[index]?.CityId
                                ? "error"
                                : ""
                            }
                            loading={isCitiesLoading || isCitiesFetching}
                            options={cities?.data?.map((city) => ({
                              value: city.id,
                              label: lang === "ar" ? city.arName : city.name,
                            }))}
                          />
                        )}
                      />
                      {errors?.TransportationFees?.[index]?.CityId && (
                        <p>{errors.TransportationFees[index].CityId.message}</p>
                      )}
                    </div>

                    <div>
                      <label>{t("FEES")}</label>

                      <Controller
                        control={control}
                        name={`TransportationFees.${index}.Fee`}
                        rules={{
                          required: {
                            value: true,
                            message: t("REQUIRED"),
                          },
                          pattern: {
                            value: /^\d+$/,
                            message: t("ONLY_NUMBER"),
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            variant="filled"
                            placeholder="Enter Fees"
                            className="placeholder:capitalize"
                            status={
                              errors?.TransportationFees?.[index]?.Fee
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />

                      {errors?.TransportationFees?.[index]?.Fee ? (
                        <p>
                          {errors?.TransportationFees?.[index]?.Fee?.message}
                        </p>
                      ) : null}
                    </div>

                    <span className="mt-6">
                      <Button
                        type="default"
                        onClick={() => removeTransportation(index)}
                        className="bg-red-700 text-white capitalize rounded-full disabled:bg-red-700/30"
                        icon={<FaMinus />}
                        disabled={transportaionFields?.length === 1}
                      />
                    </span>
                  </section>
                ))}
              </div> */}

              {/* <div>
                <label>{t("WORKING_HOURS")}</label>
                <Controller
                  control={control}
                  name="workingHours"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: t("ONLY_NUMBER"),
                    },
                  }}
                  render={({ field }) => (
                    // <Select
                    //   {...field}
                    //   className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                    //   variant="filled"
                    //   status={errors?.workingHours ? "error" : ""}
                    //   // defaultValue="male"
                    //   style={{ width: "100%" }}
                    //   onChange={(e) => {
                    //     field.onChange(e);
                    //     //   handleChange(e);
                    //   }}
                    //   options={[
                    //     { value: "1-2", label: "1-2" },
                    //     { value: "2-4", label: "2-4" },
                    //     { value: "4+", label: "4+" },
                    //   ]}
                    // />

                    <Input
                      {...field}
                      variant="filled"
                      placeholder="Enter working hours"
                      className="placeholder:capitalize"
                      status={errors?.workingHours ? "error" : ""}
                    />
                  )}
                />

                {errors?.workingHours ? (
                  <p>{errors?.workingHours?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("WHAT_HAVE")}</label>
                <Controller
                  control={control}
                  name="WhatYouWillHaveOnIt"
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
                      placeholder="Enter will you have on?"
                      className="placeholder:capitalize"
                      status={errors?.WhatYouWillHaveOnIt ? "error" : ""}
                    />
                  )}
                />

                {errors?.WhatYouWillHaveOnIt ? (
                  <p>{errors?.WhatYouWillHaveOnIt?.message}</p>
                ) : null}
              </div>

              <div>
                <label>{t("WHAT_NOT_HAVE")}</label>
                <Controller
                  control={control}
                  name="WhatYouwouldntHaveOnIt"
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
                      placeholder="Enter wouldn't you have on?"
                      className="placeholder:capitalize"
                      status={errors?.WhatYouwouldntHaveOnIt ? "error" : ""}
                    />
                  )}
                />

                {errors?.WhatYouwouldntHaveOnIt ? (
                  <p>{errors?.WhatYouwouldntHaveOnIt?.message}</p>
                ) : null}
              </div> */}

              <div className="[&>div>input]:border-[#C4C4C4] [&>div>input]:py-2">
                <div className="flex items-center gap-2 mb-1">
                  <label className="capitalize font-medium">
                    {t("TOOLS")} <Astrisk />
                  </label>
                  <Button
                    className="bg-green-600/60 hover:bg-green-600 border-green-600 text-white"
                    shape="circle"
                    size="small"
                    onClick={addMoreTools}
                    icon={<BiPlus />}
                  />
                </div>

                {toolsFields?.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <Controller
                      control={control}
                      name={`Tools.${index}.value`}
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
                          placeholder="Enter tool"
                          className="placeholder:capitalize"
                          status={
                            errors?.Tools?.[index]?.value ? "error" : ""
                          }
                        />
                      )}
                    />
                    <Button
                      variant="text"
                      color="danger"
                      onClick={() => removeTools(index)}
                      icon={<BiTrash size={25} />}
                      disabled={toolsFields.length === 1}
                    />
                  </div>
                ))}
                {toolsFields?.map((_, index) =>
                  errors?.Tools?.[index]?.value ? (
                    <p
                      key={index}
                      className="mt-1 text-xs capitalize text-mainRed"
                    >
                      {errors?.Tools?.[index]?.value?.message}
                    </p>
                  ) : null,
                )}
              </div>

              <div className="[&>div>input]:border-[#C4C4C4] [&>div>input]:py-2">
                <div className="flex items-center gap-2 mb-1">
                  <label className="capitalize font-medium">
                    {t("SUPPLIES")} <Astrisk />
                  </label>
                  <Button
                    className="bg-green-600/60 hover:bg-green-600 border-green-600 text-white"
                    shape="circle"
                    size="small"
                    onClick={addMoreSupplies}
                    icon={<BiPlus />}
                  />
                </div>

                {suppliesFields?.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <Controller
                      control={control}
                      name={`Supplies.${index}.value`}
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
                          placeholder="Enter supply"
                          className="placeholder:capitalize"
                          status={
                            errors?.Supplies?.[index]?.value ? "error" : ""
                          }
                        />
                      )}
                    />
                    <Button
                      variant="text"
                      color="danger"
                      onClick={() => removeSupplies(index)}
                      icon={<BiTrash size={25} />}
                      disabled={suppliesFields.length === 1}
                    />
                  </div>
                ))}
                {suppliesFields?.map((_, index) =>
                  errors?.Supplies?.[index]?.value ? (
                    <p
                      key={index}
                      className="mt-1 text-xs capitalize text-mainRed"
                    >
                      {errors?.Supplies?.[index]?.value?.message}
                    </p>
                  ) : null,
                )}
              </div>

              <div className="col-span-full [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2">
                <div className="flex items-center gap-2 mb-1">
                  <label className="capitalize font-medium">
                    {t("RULES")} <Astrisk />
                  </label>
                  <Button
                    className="bg-green-600/60 hover:bg-green-600 border-green-600 text-white"
                    shape="circle"
                    size="small"
                    onClick={addMoreRules}
                    icon={<BiPlus />}
                  />
                </div>

                {rulesFields?.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <Controller
                      control={control}
                      name={`Rules.${index}.value`}
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
                          placeholder="Enter rule"
                          className="placeholder:capitalize"
                          status={
                            errors?.Rules?.[index]?.value ? "error" : ""
                          }
                        />
                      )}
                    />
                    <Button
                      variant="text"
                      color="danger"
                      onClick={() => removeRules(index)}
                      icon={<BiTrash size={25} />}
                      disabled={rulesFields.length === 1}
                    />
                  </div>
                ))}
                {rulesFields?.map((_, index) =>
                  errors?.Rules?.[index]?.value ? (
                    <p
                      key={index}
                      className="mt-1 text-xs capitalize text-mainRed"
                    >
                      {errors?.Rules?.[index]?.value?.message}
                    </p>
                  ) : null,
                )}
              </div>

              <hr className="col-span-full my-2 border-[#C4C4C4]" />

              {/* Cleaning Areas */}

              <section className="cleaning-area-wrapper col-span-full">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    {t("CLEANING_AREA")} <Astrisk />
                  </h2>
                  <Button
                    className="bg-green-600/60 hover:bg-green-600 border-green-600 text-white"
                    shape="circle"
                    onClick={addMoreCleaningArea}
                    icon={<BiPlus />}
                  />
                </div>

                <div className="cleaing-area-fields-wrapper mt-4">
                  {cleaningAreaFields?.map((field, index) => (
                    <div key={field.id} className="mb-5">
                      <div className="flex items-center gap-5 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
                        <div className="grow">
                          <label>
                            {t("SELECT_CLEANING_AREA")} <Astrisk />
                          </label>
                          <Controller
                            control={control}
                            name={`CleaningAreaDetails.${index}.CleaningAreaId`}
                            rules={{
                              required: {
                                value: true,
                                message: t("REQUIRED"),
                              },
                            }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                variant="filled"
                                placeholder="Select cleaning area"
                                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                                status={
                                  errors?.CleaningAreaDetails?.[index]
                                    ?.CleaningAreaId
                                    ? "error"
                                    : ""
                                }
                                loading={
                                  isCleaningAreasLoading ||
                                  isCleaningAreasFetching
                                }
                                options={cleaningAreas?.data?.map((area) => ({
                                  value: area.id,
                                  label:
                                    lang === "en" ? area.name : area.arName,
                                }))}
                                showSearch
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              />
                            )}
                          />

                          {errors?.CleaningAreaDetails?.[index]
                            ?.CleaningAreaId ? (
                            <p>
                              {
                                errors?.CleaningAreaDetails?.[index]
                                  ?.CleaningAreaId?.message
                              }
                            </p>
                          ) : null}
                        </div>

                        <div className="grow">
                          <label>
                            {t("NAME_EN")} <Astrisk />
                          </label>
                          <Controller
                            control={control}
                            name={`CleaningAreaDetails.${index}.Name`}
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
                                placeholder="Enter name (EN)"
                                className="placeholder:capitalize"
                                status={
                                  errors?.CleaningAreaDetails?.[index]?.Name
                                    ? "error"
                                    : ""
                                }
                              />
                            )}
                          />

                          {errors?.CleaningAreaDetails?.[index]?.Name ? (
                            <p>
                              {
                                errors?.CleaningAreaDetails?.[index]?.Name
                                  ?.message
                              }
                            </p>
                          ) : null}
                        </div>

                        <div className="grow">
                          <label>
                            {t("NAME_AR")} <Astrisk />
                          </label>
                          <Controller
                            control={control}
                            name={`CleaningAreaDetails.${index}.ArName`}
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
                                placeholder="Enter  name (AR)"
                                className="placeholder:capitalize"
                                status={
                                  errors?.CleaningAreaDetails?.[index]?.ArName
                                    ? "error"
                                    : ""
                                }
                              />
                            )}
                          />

                          {errors?.CleaningAreaDetails?.[index]?.ArName ? (
                            <p>
                              {
                                errors?.CleaningAreaDetails?.[index]?.ArName
                                  ?.message
                              }
                            </p>
                          ) : null}
                        </div>

                        <div className="text-center mt-6">
                          <Button
                            variant="text"
                            color="danger"
                            onClick={() => removeCleaningArea(index)}
                            icon={<BiTrash size={35} />}
                            disabled={cleaningAreaFields.length === 1}
                          />
                        </div>
                      </div>

                      <div className="mt-3 [&>label]:block [&>label]:mb-1 [&>label]:capitalize [&>label]:font-medium [&>input]:border-[#C4C4C4] [&>input]:py-2 [&>p]:mt-1 [&>p]:text-xs [&>p]:capitalize [&>p]:text-mainRed">
                        <label>
                          {t("DESCRIPTION")} <Astrisk />
                        </label>
                        <Controller
                          control={control}
                          name={`CleaningAreaDetails.${index}.Description`}
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
                              className="placeholder:capitalize w-full"
                              status={
                                errors?.CleaningAreaDetails?.[index]?.Description
                                  ? "error"
                                  : ""
                              }
                            />
                          )}
                        />

                        {errors?.CleaningAreaDetails?.[index]?.Description ? (
                          <p>
                            {
                              errors?.CleaningAreaDetails?.[index]?.Description
                                ?.message
                            }
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                {errors?.CleaningAreaDetails?.root?.message ? (
                  <p className="text-mainRed text-xs mb-4 capitalize">
                    {errors?.CleaningAreaDetails?.root?.message}
                  </p>
                ) : null}
              </section>

              <hr className="col-span-full my-2 border-[#C4C4C4]" />

              {/* Extra Services */}

              <section className="extra-services-wrapper col-span-full">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    {t("EXTRA_SERVICES")} <Astrisk />
                  </h2>
                  <Button
                    className="bg-green-600/60 hover:bg-green-600 border-green-600 text-white"
                    shape="circle"
                    onClick={addMoreExtraServices}
                    icon={<BiPlus />}
                  />
                </div>

                <div className="extra-services-fields-wrapper mt-4">
                  {extraServicesFields?.map((field, index) => (
                    <div
                      key={field.id}
                      className="mb-5 flex items-center gap-5 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed"
                    >
                      <div className="grow">
                        <label>
                          {t("NAME_EN")} <Astrisk />
                        </label>
                        <Controller
                          control={control}
                          name={`ExtraServices.${index}.Name`}
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
                              placeholder="Enter name (EN)"
                              className="placeholder:capitalize"
                              status={
                                errors?.ExtraServices?.[index]?.Name
                                  ? "error"
                                  : ""
                              }
                            />
                          )}
                        />

                        {errors?.ExtraServices?.[index]?.Name ? (
                          <p>{errors?.ExtraServices?.[index]?.Name?.message}</p>
                        ) : null}
                      </div>

                      <div className="grow">
                        <label>
                          {t("NAME_AR")} <Astrisk />
                        </label>
                        <Controller
                          control={control}
                          name={`ExtraServices.${index}.ArName`}
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
                              placeholder="Enter  name (AR)"
                              className="placeholder:capitalize"
                              status={
                                errors?.ExtraServices?.[index]?.ArName
                                  ? "error"
                                  : ""
                              }
                            />
                          )}
                        />

                        {errors?.ExtraServices?.[index]?.ArName ? (
                          <p>
                            {errors?.ExtraServices?.[index]?.ArName?.message}
                          </p>
                        ) : null}
                      </div>

                      <div className="grow">
                        <label>
                          {t("PRICE")} <Astrisk />
                        </label>
                        <Controller
                          control={control}
                          name={`ExtraServices.${index}.Price`}
                          rules={{
                            required: {
                              value: true,
                              message: t("REQUIRED"),
                            },
                            pattern: {
                              value: /^\d+$/,
                              message: t("ONLY_NUMBER"),
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              {...field}
                              variant="filled"
                              placeholder="Enter price"
                              status={
                                errors?.ExtraServices?.[index]?.Price
                                  ? "error"
                                  : ""
                              }
                            />
                          )}
                        />

                        {errors?.ExtraServices?.[index]?.Price ? (
                          <p>
                            {errors?.ExtraServices?.[index]?.Price?.message}
                          </p>
                        ) : null}
                      </div>

                      <div className="text-center mt-6">
                        <Button
                          variant="text"
                          color="danger"
                          onClick={() => removeExtraServices(index)}
                          icon={<BiTrash size={35} />}
                          disabled={extraServicesFields.length === 1}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {errors?.ExtraServices?.root?.message ? (
                  <p className="text-mainRed text-xs mb-4 capitalize">
                    {errors?.ExtraServices?.root?.message}
                  </p>
                ) : null}
              </section>

            </section>

            <section className="w-full mt-6 flex items-center justify-center">
              <Button
                htmlType="submit"
                className="lg:min-w-[200px] p-5 border border-mainColor bg-transparent text-mainColor hover:bg-mainColor hover:text-white capitalize"
                loading={isEditPackageLoading || isAddPackageLoading}
              >
                {t("SUBMIT")}
              </Button>
            </section>
          </form>
        </div>
      )}
    </>
  );
}
