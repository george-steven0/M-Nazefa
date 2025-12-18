import { Button, Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import type {
  APIErrorProps,
  rolesFormProps,
} from "../../../components/Utilities/Types/types";
import type { TFunction } from "i18next";
import { toast } from "react-toastify";
import { useEditRoleMutation } from "../../../components/APIs/Roles/ROLE_QUERY";
import { useEffect } from "react";

type editRoleProps = {
  open: boolean;
  close: () => void;
  t: TFunction;
  data: rolesFormProps;
};

const EditRole = ({ open, close, t, data }: editRoleProps) => {
  const [editRole, { isLoading }] = useEditRoleMutation();

  const defaultValues = {
    name: data?.name,
    description: data?.description,
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<rolesFormProps>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (open && data?.id) {
      reset(defaultValues);
    }
  }, [open, data?.id]);

  const handleReset = () => {
    reset();
    close();
  };
  const submitForm = async (formData: rolesFormProps) => {
    // console.log(data);
    const formattedData = {
      ...formData,
      id: data?.id,
    };

    try {
      await editRole(formattedData).unwrap();
      toast.success("Role edited successfully");
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
        toast.error("Failed to edit role");
      }
    }
  };
  return (
    <div>
      <Modal
        title={t("EDIT_ROLE")}
        closable={{ "aria-label": "Close Button" }}
        open={open}
        // onOk={handleOk}
        onCancel={handleReset}
        footer
      >
        <form noValidate onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 gap-5 capitalize">
            <div>
              <label>{t("NAME")}</label>
              <Controller
                control={control}
                name="name"
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
                    placeholder="Enter role name"
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
                    placeholder="Enter role description"
                    className="placeholder:capitalize"
                    status={errors?.description ? "error" : ""}
                  />
                )}
              />

              {errors?.description ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.description?.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="w-full flex justify-between [&>button]:min-w-[120px] [&>button]:py-5 [&>button]:capitalize mt-8">
            <Button onClick={handleReset}>{t("CLOSE")}</Button>
            <Button
              htmlType="submit"
              className="bg-mainColor text-white border-none"
              loading={isLoading}
            >
              {t("SUBMIT")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EditRole;
