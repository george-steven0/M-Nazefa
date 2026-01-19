import { BiUpload } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ImgCrop from "antd-img-crop";
import { Button, Image, Input, Select, Upload, type UploadFile } from "antd";
import { useState } from "react";
import type {
  FileType,
  packageFormProps,
} from "../../../components/Utilities/Types/types";
import { getBase64 } from "../../../components/Utilities/helper";
import { FaMinus, FaPlus } from "react-icons/fa";

const AddPackage = () => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<packageFormProps>({
    defaultValues: {
      extra_details: [
        {
          noOfRooms: "",
          noOfWorkers: "",
          price: "",
        },
      ],
      transportaion: [
        {
          fees: "",
          country: "",
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
    name: "extra_details",
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
      noOfRooms: "",
      noOfWorkers: "",
      price: "",
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
    name: "transportaion",
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
      fees: "",
      country: "",
    });
  };

  const removeTransportation = (index: number) => {
    transportaionRemove(index);
  };

  const handleSubmitForm = (data: packageFormProps) => {
    console.log(data);
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
              name="image"
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

            {errors?.image ? <p>{errors?.image?.message}</p> : null}
          </div>

          <div>
            <label>{t("TITLE")}</label>
            <Controller
              control={control}
              name="title"
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
                  placeholder="Enter title"
                  className="placeholder:capitalize"
                  status={errors?.title ? "error" : ""}
                />
              )}
            />

            {errors?.title ? <p>{errors?.title?.message}</p> : null}
          </div>

          <div>
            <label>{t("SUB_TITLE")}</label>
            <Controller
              control={control}
              name="subTitle"
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
                  placeholder="Enter sub title"
                  className="placeholder:capitalize"
                  status={errors?.subTitle ? "error" : ""}
                />
              )}
            />

            {errors?.subTitle ? <p>{errors?.subTitle?.message}</p> : null}
          </div>

          <div className="col-span-full">
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

            {errors?.description ? <p>{errors?.description?.message}</p> : null}
          </div>

          <div className="extra-details-wrapper col-span-full">
            <div className="col-span-full flex items-center gap-2">
              <label className="font-medium text-lg">
                {t("EXTRA_DETAILS")}
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
                    name={`extra_details.${index}.noOfRooms`}
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
                          errors?.extra_details?.[index]?.noOfRooms
                            ? "error"
                            : ""
                        }
                        options={Array.from({ length: 20 })?.map(
                          (_, index) => ({
                            label: index + 1,
                            value: index + 1,
                          })
                        )}
                      />
                    )}
                  />
                  {errors?.extra_details?.[index]?.noOfRooms && (
                    <p>{errors.extra_details[index].noOfRooms.message}</p>
                  )}
                </div>

                <div>
                  <label>{t("NO_WORKERS")}</label>

                  <Controller
                    control={control}
                    name={`extra_details.${index}.noOfWorkers`}
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
                          errors?.extra_details?.[index]?.noOfWorkers
                            ? "error"
                            : ""
                        }
                        options={Array.from({ length: 20 })?.map(
                          (_, index) => ({
                            label: index + 1,
                            value: index + 1,
                          })
                        )}
                      />
                    )}
                  />
                  {errors?.extra_details?.[index]?.noOfWorkers && (
                    <p>{errors.extra_details[index].noOfWorkers.message}</p>
                  )}
                </div>

                <div>
                  <label>{t("PRICE")}</label>

                  <Controller
                    control={control}
                    name={`extra_details.${index}.price`}
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
                          errors?.extra_details?.[index]?.price ? "error" : ""
                        }
                      />
                    )}
                  />

                  {errors?.extra_details?.[index]?.price ? (
                    <p>{errors?.extra_details?.[index]?.price?.message}</p>
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

          <div className="transportation-fees-wrapper col-span-full">
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
                <div>
                  <label>{t("COUNTRY")}</label>

                  <Controller
                    control={control}
                    name={`transportaion.${index}.country`}
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
                          errors?.transportaion?.[index]?.country ? "error" : ""
                        }
                        options={Array.from({ length: 20 })?.map(
                          (_, index) => ({
                            label: index + 1,
                            value: index + 1,
                          })
                        )}
                      />
                    )}
                  />
                  {errors?.transportaion?.[index]?.country && (
                    <p>{errors.transportaion[index].country.message}</p>
                  )}
                </div>

                <div>
                  <label>{t("FEES")}</label>

                  <Controller
                    control={control}
                    name={`transportaion.${index}.fees`}
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
                          errors?.transportaion?.[index]?.fees ? "error" : ""
                        }
                      />
                    )}
                  />

                  {errors?.transportaion?.[index]?.fees ? (
                    <p>{errors?.transportaion?.[index]?.fees?.message}</p>
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
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                  variant="filled"
                  status={errors?.workingHours ? "error" : ""}
                  // defaultValue="male"
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    field.onChange(e);
                    //   handleChange(e);
                  }}
                  options={[
                    { value: "1-2", label: "1-2" },
                    { value: "2-4", label: "2-4" },
                    { value: "4+", label: "4+" },
                  ]}
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
              name="haveOn"
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
                  status={errors?.haveOn ? "error" : ""}
                />
              )}
            />

            {errors?.haveOn ? <p>{errors?.haveOn?.message}</p> : null}
          </div>

          <div>
            <label>{t("WHAT_NOT_HAVE")}</label>
            <Controller
              control={control}
              name="notHav"
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
                  status={errors?.notHav ? "error" : ""}
                />
              )}
            />

            {errors?.notHav ? <p>{errors?.notHav?.message}</p> : null}
          </div>

          <div>
            <label>{t("TOOLS")}</label>
            <Controller
              control={control}
              name="tool"
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
                  status={errors?.tool ? "error" : ""}
                />
              )}
            />

            {errors?.tool ? <p>{errors?.tool?.message}</p> : null}
          </div>

          <div>
            <label>{t("SUPPLIES")}</label>
            <Controller
              control={control}
              name="supplies"
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
                  status={errors?.supplies ? "error" : ""}
                />
              )}
            />

            {errors?.supplies ? <p>{errors?.supplies?.message}</p> : null}
          </div>

          <div>
            <label>{t("RULES")}</label>
            <Controller
              control={control}
              name="rules"
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
                  status={errors?.rules ? "error" : ""}
                />
              )}
            />

            {errors?.rules ? <p>{errors?.rules?.message}</p> : null}
          </div>

          <div className="size-full col-span-full">
            <label className="basis-full">{t("TERMS")}</label>
            <div className="p-4 flex flex-wrap items-center justify-center border border-dashed border-[#C4C4C4] rounded-sm">
              {/* <Upload {...uploadProps}>
                <Button icon={<BiUpload />}>Click to Upload</Button>
              </Upload> */}

              <Controller
                name="terms"
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
            {errors?.terms ? <p>{errors?.terms?.message}</p> : null}
          </div>
        </section>

        <section className="w-full mt-6 flex items-center justify-center">
          <Button
            htmlType="submit"
            className="lg:min-w-[200px] p-5 border border-mainColor bg-transparent text-mainColor hover:bg-mainColor hover:text-white capitalize"
          >
            {t("SUBMIT")}
          </Button>
        </section>
      </form>
    </div>
  );
};

export default AddPackage;
