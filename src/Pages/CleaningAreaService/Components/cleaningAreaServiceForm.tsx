import { Button, Input, Modal, Switch } from "antd";
import { Controller, useForm } from "react-hook-form";
import type { cleaningAreaServiceProps } from "../../../components/Utilities/Types/types";
import { handleApiError } from "../../../components/Utilities/helper";
import type { TFunction } from "i18next";
import { toast } from "react-toastify";
import { useEffect, useMemo } from "react";
import {
  useAddCleaningAreaServiceMutation,
  useEditCleaningAreaServiceMutation,
} from "../../../components/APIs/CleaningAreaService/CLEANING_AREA_SERVICE_QUERY";

type FormPropsType = {
  open: boolean;
  close: () => void;
  t: TFunction;
  data?: cleaningAreaServiceProps;
  type?: string;
};

const CleaningAreaServiceForm = ({
  open,
  close,
  t,
  data,
  type,
}: FormPropsType) => {
  const [addCleaningAreaService, { isLoading: addLoading }] =
    useAddCleaningAreaServiceMutation();
  const [editCleaningAreaService, { isLoading: editLoading }] =
    useEditCleaningAreaServiceMutation();

  const defaultValues = useMemo(() => {
    return {
      id: data?.id,
      name: data?.name,
      arName: data?.arName,
      active: data?.active ?? true,
    };
  }, [data]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<cleaningAreaServiceProps>({
    defaultValues: type === "add" ? { active: true } : defaultValues,
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

  const submitForm = async (formData: cleaningAreaServiceProps) => {
    try {
      if (type === "add") {
        await addCleaningAreaService(formData).unwrap();
        toast.success(t("CLEANING_AREA_SERVICE_ADDED_SUCCESS"));
      } else {
        await editCleaningAreaService(formData).unwrap();
        toast.success(t("CLEANING_AREA_SERVICE_UPDATED_SUCCESS"));
      }
      handleReset();
    } catch (error) {
      handleApiError(
        error,
        type === "add"
          ? t("CLEANING_AREA_SERVICE_ADD_FAILED")
          : t("CLEANING_AREA_SERVICE_UPDATE_FAILED"),
      );
    }
  };

  return (
    <div>
      <Modal
        title={
          type === "add"
            ? t("ADD_CLEANING_AREA_SERVICE")
            : t("EDIT_CLEANING_AREA_SERVICE")
        }
        closable={{ "aria-label": "Close Button" }}
        open={open}
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
                    placeholder={t("ENTER_NAME_EN")}
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
                    value: /^[؀-ۿ0-9\s]+$/,
                    message: t("ARABIC_LETTER"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder={t("ENTER_NAME_AR")}
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

            <div className="flex items-center gap-3">
              <label className="mb-0 font-medium capitalize">
                {t("STATUS")}
              </label>
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    checkedChildren={t("ACTIVE")}
                    unCheckedChildren={t("INACTIVE")}
                  />
                )}
              />
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

export default CleaningAreaServiceForm;
