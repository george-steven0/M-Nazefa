import { BiUpload } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ImgCrop from "antd-img-crop";
import { Button, Image, Input, Select, Upload, type UploadFile } from "antd";
import { useState } from "react";
import type {
  APIErrorProps,
  FileType,
  packageFormProps,
} from "../../../components/Utilities/Types/types";
import { getBase64 } from "../../../components/Utilities/helper";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useGetCitiesQuery } from "../../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import { useAppSelector } from "../../../components/APIs/store";
import { useAddPackageMutation } from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddPackage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useAppSelector((state) => state?.lang);
  const [addPackage, { isLoading: isAddPackageLoading }] =
    useAddPackageMutation();
  const {
    data: cities,
    isFetching: isCitiesFetching,
    isLoading: isCitiesLoading,
  } = useGetCitiesQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<packageFormProps>({
    defaultValues: {
      PackageDetails: [
        {
          NumberofRooms: "",
          NumberofWorkers: "",
          Price: "",
        },
      ],
      TransportationFees: [
        {
          Fee: "",
          CityId: "",
        },
      ],
    },
  });

  /* File Input */
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  /* File Input */

  const {
    fields: extraDetailsFields,
    append,
    remove,
  } = useFieldArray({
    name: "PackageDetails",
    control,
    rules: {
      required: {
        value: true,
        message: t("REQUIRED"),
      },
    },
  });

  const addMoreExtraDetails = () => {
    append({
      NumberofRooms: "",
      NumberofWorkers: "",
      Price: "",
    });
  };

  const removeExtraDetails = (index: number) => {
    remove(index);
  };

  const {
    fields: transportaionFields,
    append: transportaionAppend,
    remove: transportaionRemove,
  } = useFieldArray({
    name: "TransportationFees",
    control,
    rules: {
      required: {
        value: true,
        message: t("REQUIRED"),
      },
    },
  });

  const addMoreTransportation = () => {
    transportaionAppend({
      Fee: "",
      CityId: "",
    });
  };

  const removeTransportation = (index: number) => {
    transportaionRemove(index);
  };

  const handleSubmitForm = async (data: packageFormProps) => {
    // console.log(data);
    const formattedData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
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
      await addPackage(formattedData).unwrap();
      toast.success("Package added successfully");
      navigate("/packages");
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
      // console.log(err?.data);
    }
  };
  return (
    <div className="add-package-wrapper">
      <section className="packages-title-wrapper">
        <Title title={t("ADD_PACKAGE")} subTitle />
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
                        onVisibleChange: (visible) => setPreviewOpen(visible),
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

          <div>
            <label>{t("TITLE")}</label>
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
            <label>{t("AR_TITLE")}</label>
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
            <label>{t("SUB_TITLE")}</label>
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
            <label>{t("AR_SUB_TITLE")}</label>
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

            {errors?.ArSubTitle ? <p>{errors?.ArSubTitle?.message}</p> : null}
          </div>

          <div className="col-span-full">
            <label>{t("DESCRIPTION")}</label>
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

            {errors?.Description ? <p>{errors?.Description?.message}</p> : null}
          </div>

          <div className="extra-details-wrapper col-span-full">
            <div className="col-span-full flex items-center gap-2">
              <label className="font-medium text-lg">
                {t("PACKAGE_DETAILS")}
              </label>
              <Button
                type="default"
                onClick={addMoreExtraDetails}
                className="bg-green-700 text-white capitalize rounded-full"
                icon={<FaPlus size={13} />}
                size="small"
              />
            </div>
            {extraDetailsFields?.map((field, index) => (
              <section
                className="my-3 flex items-center gap-5 [&>div]:grow [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed"
                key={field?.id || index}
              >
                <div>
                  <label>{t("NUMBER_OF_ROOMS")}</label>

                  <Controller
                    control={control}
                    name={`PackageDetails.${index}.NumberofRooms`}
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
                        status={
                          errors?.PackageDetails?.[index]?.NumberofRooms
                            ? "error"
                            : ""
                        }
                        options={Array.from({ length: 21 })?.map(
                          (_, index) => ({
                            label: index,
                            value: index,
                          }),
                        )}
                      />
                    )}
                  />
                  {errors?.PackageDetails?.[index]?.NumberofRooms && (
                    <p>{errors.PackageDetails[index].NumberofRooms.message}</p>
                  )}
                </div>

                <div>
                  <label>{t("NO_WORKERS")}</label>

                  <Controller
                    control={control}
                    name={`PackageDetails.${index}.NumberofWorkers`}
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
                        status={
                          errors?.PackageDetails?.[index]?.NumberofWorkers
                            ? "error"
                            : ""
                        }
                        options={Array.from({ length: 21 })?.map(
                          (_, index) => ({
                            label: index + 1,
                            value: index + 1,
                          }),
                        )}
                      />
                    )}
                  />
                  {errors?.PackageDetails?.[index]?.NumberofWorkers && (
                    <p>
                      {errors.PackageDetails[index].NumberofWorkers.message}
                    </p>
                  )}
                </div>

                <div>
                  <label>{t("PRICE")}</label>

                  <Controller
                    control={control}
                    name={`PackageDetails.${index}.Price`}
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
                        status={
                          errors?.PackageDetails?.[index]?.Price ? "error" : ""
                        }
                      />
                    )}
                  />

                  {errors?.PackageDetails?.[index]?.Price ? (
                    <p>{errors?.PackageDetails?.[index]?.Price?.message}</p>
                  ) : null}
                </div>

                <span className="mt-6">
                  <Button
                    type="default"
                    onClick={() => removeExtraDetails(index)}
                    className="bg-red-700 text-white capitalize rounded-full disabled:bg-red-700/30"
                    icon={<FaMinus />}
                    disabled={extraDetailsFields?.length === 1}
                  />
                </span>
              </section>
            ))}
          </div>

          <div className="transportation-fees-wrapper col-span-full grid grid-cols-1">
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
                    <p>{errors?.TransportationFees?.[index]?.Fee?.message}</p>
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
          </div>

          <div>
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
          </div>

          <div>
            <label>{t("TOOLS")}</label>
            <Controller
              control={control}
              name="Tools"
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
                  placeholder="Enter tools"
                  className="placeholder:capitalize"
                  status={errors?.Tools ? "error" : ""}
                />
              )}
            />

            {errors?.Tools ? <p>{errors?.Tools?.message}</p> : null}
          </div>

          <div>
            <label>{t("SUPPLIES")}</label>
            <Controller
              control={control}
              name="Supplies"
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
                  placeholder="Enter supplies"
                  className="placeholder:capitalize"
                  status={errors?.Supplies ? "error" : ""}
                />
              )}
            />

            {errors?.Supplies ? <p>{errors?.Supplies?.message}</p> : null}
          </div>

          <div>
            <label>{t("RULES")}</label>
            <Controller
              control={control}
              name="Rules"
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
                  placeholder="Enter rules"
                  className="placeholder:capitalize"
                  status={errors?.Rules ? "error" : ""}
                />
              )}
            />

            {errors?.Rules ? <p>{errors?.Rules?.message}</p> : null}
          </div>

          <div className="size-full col-span-full">
            <label className="basis-full">{t("TERMS")}</label>
            <div className="p-4 flex flex-wrap items-center justify-center border border-dashed border-[#C4C4C4] rounded-sm">
              {/* <Upload {...uploadProps}>
                <Button icon={<BiUpload />}>Click to Upload</Button>
              </Upload> */}

              <Controller
                name="TermsAndConditions"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <Upload
                    beforeUpload={() => false}
                    fileList={field.value ? [field.value] : []}
                    onChange={({ file }) => field.onChange(file)}
                    onRemove={() => field.onChange(null)}
                    maxCount={1}
                  >
                    <Button icon={<BiUpload />}>Upload file</Button>
                  </Upload>
                )}
              />
            </div>
            {errors?.TermsAndConditions ? (
              <p>{errors?.TermsAndConditions?.message}</p>
            ) : null}
          </div>
        </section>

        <section className="w-full mt-6 flex items-center justify-center">
          <Button
            htmlType="submit"
            className="lg:min-w-[200px] p-5 border border-mainColor bg-transparent text-mainColor hover:bg-mainColor hover:text-white capitalize"
            loading={isAddPackageLoading}
          >
            {t("SUBMIT")}
          </Button>
        </section>
      </form>
    </div>
  );
};

export default AddPackage;
