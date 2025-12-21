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
  APIErrorProps,
  employeeFormProps,
  FileType,
} from "../../../components/Utilities/Types/types";
import dayjs from "dayjs";
import { getBase64 } from "../../../components/Utilities/helper";
import { useGetAllRolesQuery } from "../../../components/APIs/Roles/ROLE_QUERY";
import { useAddEmployeeMutation } from "../../../components/APIs/EmployeesQuery/EMPLOYEES_QUERY";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { DOMAIN, options } from "../../../components/Utilities/consts";

const AddEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<employeeFormProps>();

  /* File Input */
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const { data } = useGetAllRolesQuery(null);

  const [addEmployee, { isLoading }] = useAddEmployeeMutation();
  // console.log(data?.data);

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
  /* Compress File Input */
  const handleFileUpload = async (file: File) => {
    const compressedFile = await imageCompression(file, options);

    const formattedFile = new File(
      [compressedFile],
      file.name.replace(/\.[^/.]+$/, ".jpg"),
      {
        type: "image/jpeg",
      }
    );
    // console.log(formattedFile);

    setValue("ImageFile", formattedFile);
  };
  /* Compress File Input */

  //reset form
  const resetForm = () => {
    reset();
  };
  const submitForm = async (data: employeeFormProps) => {
    const formattedData = {
      ...data,
      DateOfBirth: dayjs(data.DateOfBirth)?.toISOString(),
      StartingDate: dayjs(data.StartingDate)?.toISOString(),
      Email: data?.Email
        ? `${data.Email.trim().replace(/@.*/, "")}${DOMAIN}`
        : undefined,
    };

    const formData = new FormData();
    await Object.entries(formattedData).forEach(([key, value]) => {
      // Handle different types of values
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // console.log(formattedData);

    try {
      await addEmployee(formData).unwrap();
      toast.success("Employee added successfully");
      navigate("/employees");
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages && err?.data?.errorMessages.length > 0) {
        err?.data?.errorMessages?.map((err) => toast.error(err));
      } else {
        toast.error("Failed to add employee");
      }
    }
  };

  // Roles

  const roles = data?.data?.map((role) => ({
    value: role.id,
    label: role.name?.replace(/([A-Z])/g, " $1"),
  }));
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
                name="ImageFile"
                // rules={{
                //   required: {
                //     value: true,
                //     message: t("REQUIRED"),
                //   },
                // }}
                render={({ field }) => (
                  <>
                    <ImgCrop rotationSlider>
                      <Upload
                        {...field}
                        listType="picture-circle"
                        fileList={fileList}
                        onChange={({ file, fileList }) => {
                          setFileList(fileList); // took fielist because it must take an array of files
                          // console.log(fileList[0]?.originFileObj);

                          if (file) {
                            // console.log(file);

                            field.onChange(file);
                            handleFileUpload(
                              fileList[0]?.originFileObj as File
                            );
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

              {errors?.ImageFile ? <p>{errors?.ImageFile?.message}</p> : null}
            </div>

            <div>
              <label>{t("FIRST_NAME")}</label>
              <Controller
                control={control}
                name="FirstName"
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
                    status={errors?.FirstName ? "error" : ""}
                  />
                )}
              />

              {errors?.FirstName ? <p>{errors?.FirstName?.message}</p> : null}
            </div>

            <div>
              <label>{t("LAST_NAME")}</label>

              <Controller
                control={control}
                name="LastName"
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
                    status={errors?.LastName ? "error" : ""}
                  />
                )}
              />

              {errors?.LastName ? <p>{errors?.LastName?.message}</p> : null}
            </div>

            <div>
              <label>{t("GENDER")}</label>
              <Controller
                control={control}
                name="Gender"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select gender"
                    className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                    variant="filled"
                    status={errors?.Gender ? "error" : ""}
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

              {errors?.Gender ? <p>{errors?.Gender?.message}</p> : null}
            </div>

            <div>
              <label>{t("PHONE_NUMBER")}</label>
              <Controller
                control={control}
                name="PhoneNumber"
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
                    status={errors?.PhoneNumber ? "error" : ""}
                  />
                )}
              />

              {errors?.PhoneNumber ? (
                <p>{errors?.PhoneNumber?.message}</p>
              ) : null}
            </div>

            <div>
              <label>{t("EMAIL")}</label>
              <Controller
                control={control}
                name="Email"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+$/,
                    message: "Email is not valid",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter email"
                    addonAfter={DOMAIN}
                    className="placeholder:capitalize [&_.ant-input]:py-[6px] border border-[#C4C4C4] rounded-md"
                    status={errors?.Email ? "error" : ""}
                    onKeyDown={(e) => {
                      if (e.key === "@") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value.toLowerCase());
                    }}
                  />
                )}
              />

              {errors?.Email ? <p>{errors?.Email?.message}</p> : null}
            </div>

            <div>
              <label>{t("USER_NAME")}</label>
              <Controller
                control={control}
                name="UserName"
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
                    placeholder="Enter user name"
                    className="placeholder:capitalize"
                    status={errors?.UserName ? "error" : ""}
                  />
                )}
              />

              {errors?.UserName ? <p>{errors?.UserName?.message}</p> : null}
            </div>

            <div>
              <label>{t("PASSWORD")}</label>
              <Controller
                control={control}
                name="Password"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                  minLength: {
                    value: 8,
                    message: t("MIN_LENGTH", { length: 8 }),
                  },
                  pattern: {
                    value:
                      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
                    message: t("PASSWORD_PATTERN_MESSAGE"),
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    variant="filled"
                    placeholder="Enter Password"
                    className="placeholder:capitalize py-2 border-[#C4C4C4]"
                    status={errors?.Password ? "error" : ""}
                  />
                )}
              />

              {errors?.Password ? <p>{errors?.Password?.message}</p> : null}
            </div>

            <div>
              <label>{t("DATE_OF_BIRTH")}</label>
              <Controller
                control={control}
                name="DateOfBirth"
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
                    status={errors?.DateOfBirth ? "error" : ""}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(e) => {
                      field.onChange(dayjs(e));
                    }}
                  />
                )}
              />
              {errors?.DateOfBirth ? (
                <p>{errors?.DateOfBirth?.message}</p>
              ) : null}
            </div>

            <div>
              <label>{t("EMPLOYEE_ROLE")}</label>
              <Controller
                control={control}
                name="Role"
                // rules={{
                //   required: {
                //     value: true,
                //     message: t("REQUIRED"),
                //   },
                // }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Role"
                    mode="tags"
                    className="h-auto border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize [&_.ant-select-selection-wrap]:h-full [&_.ant-select-selection-wrap]:py-[3px] [&_.ant-select-selection-wrap]:capitalize"
                    variant="filled"
                    styles={{
                      popup: {
                        root: {
                          textTransform: "capitalize",
                        },
                      },
                    }}
                    status={errors?.Role ? "error" : ""}
                    // defaultValue="male"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      field.onChange(e);
                      //   handleChange(e);
                    }}
                    options={roles}
                  />
                )}
              />

              {errors?.Role ? <p>{errors?.Role?.message}</p> : null}
            </div>

            {/* <div>
              <label>{t("WORK_ID")}</label>
              <Controller
                control={control}
                name="WorkId"
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
                    status={errors?.WorkId ? "error" : ""}
                  />
                )}
              />

              {errors?.WorkId ? <p>{errors?.WorkId?.message}</p> : null}
            </div> */}

            <div>
              <label>{t("STARTING_DATE")}</label>
              <Controller
                control={control}
                name="StartingDate"
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
                    status={errors?.StartingDate ? "error" : ""}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(e) => {
                      field.onChange(dayjs(e));
                    }}
                  />
                )}
              />
              {errors?.StartingDate ? (
                <p>{errors?.StartingDate?.message}</p>
              ) : null}
            </div>

            <div>
              <label>{t("ID_NUMBER")}</label>
              <Controller
                control={control}
                name="IdNumber"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
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
                    status={errors?.IdNumber ? "error" : ""}
                    maxLength={14}
                    minLength={14}
                  />
                )}
              />

              {errors?.IdNumber ? <p>{errors?.IdNumber?.message}</p> : null}
            </div>

            <div>
              <label>{t("POSTAL_CODE")}</label>
              <Controller
                control={control}
                name="PostalCode"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: t("ONLY_NUMBER"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter postal code"
                    className="placeholder:capitalize"
                    status={errors?.PostalCode ? "error" : ""}
                  />
                )}
              />

              {errors?.PostalCode ? <p>{errors?.PostalCode?.message}</p> : null}
            </div>

            <div className="col-span-full">
              <label>{t("ADDRESS")}</label>
              <Controller
                control={control}
                name="Address"
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
                    placeholder="Enter address"
                    className="placeholder:capitalize"
                    status={errors?.Address ? "error" : ""}
                  />
                )}
              />

              {errors?.Address ? <p>{errors?.Address?.message}</p> : null}
            </div>

            <section className="form_btn col-span-full mt-8 flex items-center justify-center gap-4 [&>button]:py-[18px] [&>button]:min-w-[100px] [&>button]:capitalize">
              <Button className="bg-lightGray text-black" onClick={resetForm}>
                {t("RESET")}
              </Button>
              <Button
                loading={isLoading}
                htmlType="submit"
                className="bg-mainColor text-white"
              >
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
