import { BiUpload } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import { Controller, useForm } from "react-hook-form";
import ImgCrop from "antd-img-crop";
import { Button, Image, Input, Select, Upload, type UploadFile } from "antd";
import { useState } from "react";
import type {
  FileType,
  packageFormProps,
} from "../../../components/Utilities/Types/types";
import { getBase64 } from "../../../components/Utilities/helper";

const AddPackage = () => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<packageFormProps>();

  /* File Input */
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  //   const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
  //     setFileList(newFileList.slice(-1));
  //   };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  /* File Input */

  /* Upload Attachemnt */
  // const [uploadFile] = useUploadFileMutation();

  // const uploadProps: UploadProps = {
  //   customRequest: async ({ file, onSuccess, onError }) => {
  //     try {
  //       const formData = new FormData();
  //       formData.append("file", file as Blob);

  //       // const res = await uploadFile(formData).unwrap();
  //       const res = "TEST";

  //       onSuccess?.(res);
  //       message.success("File uploaded successfully");
  //     } catch (err: unknown) {
  //       onError?.(err);
  //       message.error("Upload failed");
  //     }
  //   },
  // };
  /* Upload Attachemnt */
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
                  placeholder="Enter sub ttle"
                  className="placeholder:capitalize"
                  status={errors?.subTitle ? "error" : ""}
                />
              )}
            />

            {errors?.subTitle ? <p>{errors?.subTitle?.message}</p> : null}
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

            {errors?.description ? <p>{errors?.description?.message}</p> : null}
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
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    field.onChange(e);
                    //   handleChange(e);
                  }}
                  options={[
                    { value: "1", label: "1" },
                    { value: "2-4", label: "2-4" },
                    { value: "4+", label: "4+" },
                  ]}
                />
              )}
            />

            {errors?.numberOfWorkers ? (
              <p>{errors?.numberOfWorkers?.message}</p>
            ) : null}
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
            <label>{t("TOOL")}</label>
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
                  placeholder="Enter tooles"
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

          <div className="size-full ">
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
