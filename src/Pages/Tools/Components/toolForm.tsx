import { Button, Input, Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import type { toolProps } from "../../../components/Utilities/Types/types";
import { handleApiError } from "../../../components/Utilities/helper";
import type { TFunction } from "i18next";
import { toast } from "react-toastify";
import {
  useAddToolMutation,
  useEditToolMutation,
} from "../../../components/APIs/Tools/TOOLS_QUERY";
import { useEffect, useMemo } from "react";

type toolFormProps = {
  open: boolean;
  close: () => void;
  t: TFunction;
  data?: toolProps;
  type?: string;
};

const TOOL_TYPES = ["Tools", "Supplies", "Machines"];

const ToolForm = ({ open, close, t, data, type }: toolFormProps) => {
  const [addTool, { isLoading: addLoading }] = useAddToolMutation();
  const [editTool, { isLoading: editLoading }] = useEditToolMutation();

  const defaultValues = useMemo(() => {
    return {
      id: data?.id,
      name: data?.name,
      arName: data?.arName,
      type: data?.type,
    };
  }, [data]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<toolProps>({
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

  const submitForm = async (data: toolProps) => {
    try {
      if (type === "add") {
        await addTool(data).unwrap();
        toast.success(t("TOOL_ADDED_SUCCESS"));
      } else {
        await editTool(data).unwrap();
        toast.success(t("TOOL_UPDATED_SUCCESS"));
      }
      handleReset();
    } catch (error) {
      handleApiError(
        error,
        type === "add" ? t("TOOL_ADD_FAILED") : t("TOOL_UPDATE_FAILED"),
      );
    }
  };

  return (
    <div>
      <Modal
        title={type === "add" ? t("ADD_TOOL") : t("EDIT_TOOL")}
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
                    value: /^[a-zA-Z0-9\s!@#$%^&*()_+=~`|;:'",.<>?{}[\]\\/-]+$/,
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
                  pattern: {
                    value: /^[؀-ۿ0-9\s!@#$%^&*()_+=~`|;:'",.<>?{}[\]\\/-]+$/,
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

            <div>
              <label>{t("TYPE")}</label>
              <Controller
                control={control}
                name="type"
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
                    placeholder={t("SELECT_TYPE")}
                    className="w-full"
                    status={errors?.type ? "error" : ""}
                    options={TOOL_TYPES.map((toolType) => ({
                      value: toolType,
                      label: t(toolType.toUpperCase()) || toolType,
                    }))}
                  />
                )}
              />

              {errors?.type ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.type?.message}
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

export default ToolForm;
