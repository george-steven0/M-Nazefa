import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import ImgCrop from "antd-img-crop";
import {
  Button,
  DatePicker,
  Image,
  Input,
  Select,
  Skeleton,
  Upload,
  type UploadFile,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type {
  APIErrorProps,
  employeeFormProps,
  FileType,
} from "../../../components/Utilities/Types/types";
import dayjs from "dayjs";
import { getBase64 } from "../../../components/Utilities/helper";
import { useGetAllRolesQuery } from "../../../components/APIs/Roles/ROLE_QUERY";
import {
  useEditEmployeeMutation,
  useGetEmployeeByIdQuery,
} from "../../../components/APIs/EmployeesQuery/EMPLOYEES_QUERY";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DOMAIN, options } from "../../../components/Utilities/consts";
import imageCompression from "browser-image-compression";
import ChangePassword from "./changePassword";

const EditEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const id = params.get("id");
  const {
    data: employeeData,
    isFetching,
    isLoading: isLoadingEmployee,
  } = useGetEmployeeByIdQuery(
    { id: id! },
    {
      skip: !id,
    }
  );

  // Roles
  const { data, isSuccess: isRolesSuccess } = useGetAllRolesQuery(null);

  const roles = data?.data?.map((role) => ({
    value: role.id,
    label: role.name?.replace(/([A-Z])/g, " $1"),
  }));
  const defaultRolesId = data?.data
    ?.filter((role) => employeeData?.data?.roles?.includes(role.name))
    .map((role) => role.id);

  // console.log(roles);
  // console.log(employeeData?.data?.roles);

  const defaultValues = {
    FirstName: employeeData?.data?.firstName,
    LastName: employeeData?.data?.lastName,
    UserName: employeeData?.data?.userName,
    Gender: employeeData?.data?.gender,
    DateOfBirth: employeeData?.data?.dateOfBirth,
    PhoneNumber: employeeData?.data?.phoneNumber,
    Email: employeeData?.data?.email,
    Address: employeeData?.data?.address,
    PostalCode: employeeData?.data?.postalCode,
    IdNumber: employeeData?.data?.idNumber,
    WorkId: employeeData?.data?.workId,
    StartingDate: employeeData?.data?.startingDate,
    Role: employeeData?.data?.roles,
    ImagePath: employeeData?.data?.imagePath,
    ImageFile: employeeData?.data?.imagePath,
  };
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    // trigger,
    formState: { errors },
  } = useForm<employeeFormProps>({
    defaultValues: defaultValues,
    // mode: "onChange",
    // reValidateMode: "onChange",
  });

  useEffect(() => {
    // console.log(isRolesSuccess);

    if (id && employeeData?.isSuccess && isRolesSuccess) {
      reset({
        ...defaultValues,
        Roles: defaultRolesId,
      });
    }
  }, [id, employeeData?.isSuccess, isRolesSuccess, reset]);

  // console.log(getValues());

  /* File Input */
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [IsImageChanged, setIsImageChanged] = useState(false);

  // console.log(employeeData);

  const [editEmployee, { isLoading }] = useEditEmployeeMutation();
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

    setValue("File", formattedFile, { shouldValidate: true });
    setIsImageChanged(true);
  };
  /* Compress File Input */

  //Gender Select
  //   const handleChange = (value: string) => {
  //     console.log(`selected ${value}`);
  //   };

  //reset form
  const resetForm = () => {
    reset(defaultValues);
    setIsImageChanged(false);

    // setPreviewImage("");
    // setFileList([]);
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

    // console.log(formattedData);

    const formData = new FormData();
    await formData.append("Id", id!);
    await formData.append("IsImageChanged", IsImageChanged?.toString());

    await Object.entries(formattedData).forEach(([key, value]) => {
      // Handle different types of values
      if (Array.isArray(value)) {
        value.forEach((v, index) => formData.append(`${key}[${index}]`, v));
        // formData.append(key, value?.toString());
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      await editEmployee(formData).unwrap();
      toast.success("Employee updated successfully");
      navigate("/employees");
      setIsImageChanged(false);
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages && err?.data?.errorMessages.length > 0) {
        err?.data?.errorMessages?.map((err) => toast.error(err));
      } else {
        toast.error("Failed to update employee");
      }
    }
  };

  useEffect(() => {
    if (employeeData?.data?.imagePath) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: employeeData.data.imagePath,
        } as UploadFile,
      ]);
    }
  }, [employeeData]);

  // console.log(fileList);

  // Change Password Modal

  const [openChangePassword, setopenChangePassword] = useState(false);

  const handleChangePasswordModal = () => {
    setopenChangePassword((prev) => !prev);
  };

  return (
    <div className="edit-employee">
      <section className="new-employee-title-wrapper">
        <Title
          title={t("EDIT_EMPLOYEE")}
          subTitle
          component={
            <div>
              <Button
                onClick={handleChangePasswordModal}
                className="py-5 min-w-[180px] bg-mainColor text-white"
              >
                {t("CHANGE_PASSWORD")}
              </Button>
            </div>
          }
        />
      </section>

      {isLoadingEmployee || isFetching ? (
        <Skeleton avatar active paragraph={{ rows: 15 }} />
      ) : (
        <section className="edit-employee-content w-full">
          <div className="edit-employee-form">
            <form
              noValidate
              onSubmit={handleSubmit(submitForm)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed"
            >
              <div className="employee-image col-span-full text-center w-full flex flex-col justify-center items-center gap-1">
                <Controller
                  control={control}
                  name="File"
                  // rules={{
                  //   validate: () => fileList.length > 0 || t("REQUIRED"),
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

                            if (file) {
                              // console.log(file);

                              field.onChange(file);
                              handleFileUpload(
                                fileList[0]?.originFileObj as File
                              );
                              // trigger("File");
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

                {errors?.File ? <p>{errors?.File?.message}</p> : null}
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

              {/* <div>
                <label>{t("PASSWORD")}</label>
                <Controller
                  control={control}
                  name="Password"
                  rules={{
                    required: {
                      value: true,
                      message: t("REQUIRED"),
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
              </div> */}

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
                  name="Roles"
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
                      mode="multiple"
                      className="h-auto border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize [&_.ant-select-selection-wrap]:h-full [&_.ant-select-selection-wrap]:py-[3px] [&_.ant-select-selection-wrap]:capitalize"
                      variant="filled"
                      styles={{
                        popup: {
                          root: {
                            textTransform: "capitalize",
                          },
                        },
                      }}
                      status={errors?.Roles ? "error" : ""}
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

                {errors?.Roles ? <p>{errors?.Roles?.message}</p> : null}
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

                {errors?.PostalCode ? (
                  <p>{errors?.PostalCode?.message}</p>
                ) : null}
              </div>

              <div>
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
                  {t("EDIT_EMPLOYEE")}
                </Button>
              </section>
            </form>
          </div>
        </section>
      )}
      <ChangePassword
        open={openChangePassword}
        close={handleChangePasswordModal}
        t={t}
        userName={employeeData?.data?.userName ?? ""}
        id={id ?? ""}
      />
    </div>
  );
};

export default EditEmployee;
