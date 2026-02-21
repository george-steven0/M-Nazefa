import { Button, Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import type {
  APIErrorProps,
  seedersProps,
} from "../../../components/Utilities/Types/types";
import type { TFunction } from "i18next";
import { toast } from "react-toastify";
import {
  useAddPackageTypeMutation,
  useEditPackageTypeMutation,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { useEffect, useMemo } from "react";

type packageTypeFormProps = {
  open: boolean;
  close: () => void;
  t: TFunction;
  data?: seedersProps;
  type?: string;
};

const PackageTypeForm = ({
  open,
  close,
  t,
  data,
  type,
}: packageTypeFormProps) => {
  const [addPackageType, { isLoading: addLoading }] =
    useAddPackageTypeMutation();
  const [editPackageType, { isLoading: editLoading }] =
    useEditPackageTypeMutation();

  const defaultValues = useMemo(() => {
    return {
      id: data?.id,
      name: data?.name,
      arName: data?.arName,
    };
  }, [data]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<seedersProps>({
    defaultValues: type === "add" ? {} : defaultValues,
  });

  useEffect(() => {
    if (data && type === "edit") {
      reset(defaultValues);
    }
  }, [type, data, reset, defaultValues]);

  const handleReset = () => {
    reset();
    close();
  };
  const submitForm = async (data: seedersProps) => {
    // console.log(data);

    try {
      if (type === "add") {
        await addPackageType(data).unwrap();
        toast.success("Package type added successfully");
      } else {
        await editPackageType(data).unwrap();
        toast.success("Package type updated successfully");
      }
      handleReset();
    } catch (error) {
      const err = error as APIErrorProps;
      // console.log(err);

      if (
        err?.data?.validationErrors &&
        err?.data?.validationErrors.length > 0
      ) {
        const errs =
          err?.data?.errorMessage && err?.data?.errorMessage.join("\n");
        toast.error(errs);
      } else {
        toast.error(
          type === "add"
            ? "Failed to add package type"
            : "Failed to update package type",
        );
      }
    }
  };
  return (
    <div>
      <Modal
        title={type === "add" ? t("ADD_PACKAGE_TYPE") : t("EDIT_PACKAGE_TYPE")}
        closable={{ "aria-label": "Close Button" }}
        open={open}
        // onOk={handleOk}
        onCancel={handleReset}
        footer
      >
        <form noValidate onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 gap-5 capitalize [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
            <div>
              <label>{t("NAME_EN")}</label>
              <Controller
                control={control}
                name="name"
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
                    status={errors?.name ? "error" : ""}
                  />
                )}
              />

              {errors?.name ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.name?.message}
                </p>
              ) : null}
            </div>

            <div>
              <label>{t("NAME_AR")}</label>
              <Controller
                control={control}
                name="arName"
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
                    placeholder="Enter name (AR)"
                    className="placeholder:capitalize"
                    status={errors?.arName ? "error" : ""}
                  />
                )}
              />

              {errors?.arName ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.arName?.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="w-full flex justify-between [&>button]:min-w-[120px] [&>button]:py-5 [&>button]:capitalize mt-8">
            <Button onClick={handleReset}>{t("CLOSE")}</Button>
            <Button
              htmlType="submit"
              className="bg-mainColor text-white border-none"
              loading={addLoading || editLoading}
            >
              {type === "add" ? t("SUBMIT") : t("UPDATE")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackageTypeForm;
