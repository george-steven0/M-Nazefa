import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import ImgCrop from "antd-img-crop";
import {
  Button,
  DatePicker,
  Image,
  Input,
  Select,
  Upload,
  type UploadFile,
} from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type {
  employeeFormProps,
  FileType,
} from "../../../components/Utilities/Types/types";
import dayjs from "dayjs";
import { getBase64 } from "../../../components/Utilities/helper";

const AddEmployee = () => {
  const { t } = useTranslation();
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<employeeFormProps>();

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
  /* End File Input */

  //Gender Select
  //   const handleChange = (value: string) => {
  //     console.log(`selected ${value}`);
  //   };

  //reset form
  const resetForm = () => {
    reset();
  };
  const submitForm = (data: employeeFormProps) => {
    const formattedData = {
      ...data,
      dateOfBirth: dayjs(data.dateOfBirth)?.format("YYYY-MM-DD"),
      startingDate: dayjs(data.startingDate)?.format("YYYY-MM-DD"),
    };
    console.log(formattedData);
  };
  return (
    <div className="add-new-employee">
      <section className="new-employee-title-wrapper">
        <Title title={t("ADD_EMPLOYEE")} subTitle />
      </section>

      <section className="add-employee-content w-full">
        <div className="add-employee-form">
          <form
            noValidate
            onSubmit={handleSubmit(submitForm)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed"
          >
            <div className="employee-image col-span-full text-center w-full flex flex-col justify-center items-center gap-1">
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
                    placeholder="Enter first name"
                    className="placeholder:capitalize"
                    status={errors?.lastName ? "error" : ""}
                  />
                )}
              />

              {errors?.lastName ? <p>{errors?.lastName?.message}</p> : null}
            </div>

            <div>
              <label>{t("GENDER")}</label>
              <Controller
                control={control}
                name="gender"
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
                    status={errors?.gender ? "error" : ""}
                    // defaultValue="male"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      field.onChange(e);
                      //   handleChange(e);
                    }}
                    options={[
                      { value: "male", label: t("MALE") },
                      { value: "female", label: t("FEMALE") },
                      // { value: 'Yiminghe', label: 'yiminghe' },
                      // { value: 'disabled', label: 'Disabled', disabled: true },
                    ]}
                  />
                )}
              />

              {errors?.gender ? <p>{errors?.gender?.message}</p> : null}
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
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter first name"
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
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter first name"
                    className="placeholder:capitalize"
                    status={errors?.email ? "error" : ""}
                  />
                )}
              />

              {errors?.email ? <p>{errors?.email?.message}</p> : null}
            </div>

            <div>
              <label>{t("DATE_OF_BIRTH")}</label>
              <Controller
                control={control}
                name="dateOfBirth"
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
                    status={errors?.dateOfBirth ? "error" : ""}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(e) => {
                      field.onChange(dayjs(e));
                    }}
                  />
                )}
              />
              {errors?.dateOfBirth ? (
                <p>{errors?.dateOfBirth?.message}</p>
              ) : null}
            </div>

            <div>
              <label>{t("EMPLOYEE_ROLE")}</label>
              <Controller
                control={control}
                name="role"
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
                    status={errors?.role ? "error" : ""}
                  />
                )}
              />

              {errors?.role ? <p>{errors?.role?.message}</p> : null}
            </div>

            {/* <div>
              <label>{t("WORK_ID")}</label>
              <Controller
                control={control}
                name="workId"
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
                    status={errors?.workId ? "error" : ""}
                  />
                )}
              />

              {errors?.workId ? <p>{errors?.workId?.message}</p> : null}
            </div> */}

            <div>
              <label>{t("STARTING_DATE")}</label>
              <Controller
                control={control}
                name="startingDate"
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
                    status={errors?.startingDate ? "error" : ""}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(e) => {
                      field.onChange(dayjs(e));
                    }}
                  />
                )}
              />
              {errors?.startingDate ? (
                <p>{errors?.startingDate?.message}</p>
              ) : null}
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
                    placeholder="Enter first name"
                    className="placeholder:capitalize"
                    status={errors?.idNumber ? "error" : ""}
                  />
                )}
              />

              {errors?.idNumber ? <p>{errors?.idNumber?.message}</p> : null}
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
                    placeholder="Enter first name"
                    className="placeholder:capitalize"
                    status={errors?.postalCode ? "error" : ""}
                  />
                )}
              />

              {errors?.postalCode ? <p>{errors?.postalCode?.message}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label>{t("ADDRESS")}</label>
              <Controller
                control={control}
                name="address"
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
                    status={errors?.address ? "error" : ""}
                  />
                )}
              />

              {errors?.address ? <p>{errors?.address?.message}</p> : null}
            </div>

            <section className="form_btn col-span-full mt-8 flex items-center justify-center gap-4 [&>button]:py-[18px] [&>button]:min-w-[100px] [&>button]:capitalize">
              <Button className="bg-lightGray text-black" onClick={resetForm}>
                {t("RESET")}
              </Button>
              <Button htmlType="submit" className="bg-mainColor text-white">
                {t("ADD_EMPLOYEE")}
              </Button>
            </section>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddEmployee;
