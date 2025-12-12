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

const EditEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const id = params.get("id");
  const { data: employeeData } = useGetEmployeeByIdQuery(
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

  const defaultValues = {
    FirstName: employeeData?.data?.fullName?.split(" ")[0],
    LastName: employeeData?.data?.fullName?.split(" ")[1],
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
  };
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<employeeFormProps>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    // console.log(isRolesSuccess);

    if (id && employeeData?.isSuccess && isRolesSuccess) {
      const defaultRoleIds = roles
        ?.filter((role) =>
          employeeData?.data?.roles?.map((label) => label === role?.label)
        )
        ?.map((role) => role?.value);
      // console.log(defaultRoleIds);

      reset({
        ...defaultValues,
        Role: defaultRoleIds,
      });
    }
  }, [id, employeeData?.isSuccess, isRolesSuccess, reset]);

  // console.log(getValues());

  /* File Input */
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

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
  /* End File Input */

  //Gender Select
  //   const handleChange = (value: string) => {
  //     console.log(`selected ${value}`);
  //   };

  //reset form
  const resetForm = () => {
    reset(defaultValues);
    // setPreviewImage("");
    // setFileList([]);
  };

  const submitForm = async (data: employeeFormProps) => {
    const formattedData = {
      ...data,
      DateOfBirth: dayjs(data.DateOfBirth)?.toISOString(),
      StartingDate: dayjs(data.StartingDate)?.toISOString(),
    };

    // console.log(formattedData);

    const formData = new FormData();
    await Object.entries(formattedData).forEach(([key, value]) => {
      // Handle different types of values
      // if (Array.isArray(value)) {
      //   value.forEach((v) => formData.append(key, v));
      // } else if (value instanceof File) {
      //   formData.append(key, value);
      // } else if (value !== undefined && value !== null) {
      //   formData.append(key, String(value));
      // }
      formData.append(key, String(value));
    });
    await formData.append("Id", id!);

    try {
      await editEmployee(formData).unwrap();
      toast.success("Employee updated successfully");
      navigate("/employees");
    } catch (error) {
      const err = error as APIErrorProps;
      if (
        err?.data?.validationErrors &&
        err?.data?.validationErrors.length > 0
      ) {
        const errs = err?.data?.validationErrors.join("\n");
        toast.error(errs);
      } else {
        toast.error("Failed to update employee");
      }
    }
  };

  return (
    <div className="edit-employee">
      <section className="new-employee-title-wrapper">
        <Title title={t("EDIT_EMPLOYEE")} subTitle />
      </section>

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
                name="ImageFile"
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
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter email"
                    className="placeholder:capitalize"
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
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Role"
                    mode="multiple"
                    className="h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize [&_.ant-select-selection-wrap]:h-full"
                    variant="filled"
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
                {t("EDIT_EMPLOYEE")}
              </Button>
            </section>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditEmployee;
