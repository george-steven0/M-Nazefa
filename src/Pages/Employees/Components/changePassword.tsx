import { Button, Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import type {
  APIErrorProps,
  changePasswordForm,
} from "../../../components/Utilities/Types/types";
import type { TFunction } from "i18next";
import { useChangePasswordMutation } from "../../../components/APIs/EmployeesQuery/EMPLOYEES_QUERY";
import { toast } from "react-toastify";

type changePasswordProps = {
  open: boolean;
  close: () => void;
  t: TFunction;
  userName: string;
  id: string;
};

const ChangePassword = ({
  open,
  close,
  t,
  userName,
  id,
}: changePasswordProps) => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<changePasswordForm>();

  const handleReset = () => {
    reset();
    close();
  };
  const submitForm = async (data: changePasswordForm) => {
    const formatData = {
      ...data,
      employeeId: id,
    };

    // console.log(formatData);

    try {
      await changePassword(formatData).unwrap();
      toast.success("Password changed successfully");
      handleReset();
    } catch (error) {
      const err = error as APIErrorProps;
      // console.log(err);

      if (
        err?.data?.validationErrors &&
        err?.data?.validationErrors.length > 0
      ) {
        const errs = err?.data?.errorMessage?.join("\n");
        toast.error(errs);
      } else {
        toast.error("Failed to change password");
      }
    }
  };
  return (
    <div>
      <Modal
        title="Change Password"
        closable={{ "aria-label": "Close Button" }}
        open={open}
        // onOk={handleOk}
        onCancel={handleReset}
        footer
      >
        <form noValidate onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label>{t("USER_NAME")}</label>
              <Input
                variant="filled"
                // placeholder="Enter first name"
                value={userName}
                readOnly
                className="placeholder:capitalize"
                // status={errors?.newPassword ? "error" : ""}
              />
            </div>

            <div>
              <label>{t("NEW_PASSWORD")}</label>
              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                  minLength: {
                    value: 8,
                    message: t("MIN_LENGTH", { length: 8 }),
                  },

                  maxLength: {
                    value: 22,
                    message: t("MAX_LENGTH", { length: 22 }),
                  },
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    variant="filled"
                    placeholder="Enter new password"
                    className="placeholder:capitalize"
                    status={errors?.newPassword ? "error" : ""}
                  />
                )}
              />

              {errors?.newPassword ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.newPassword?.message}
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

export default ChangePassword;
