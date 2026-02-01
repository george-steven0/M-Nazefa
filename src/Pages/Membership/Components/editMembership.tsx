import { Button, DatePicker, Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import type {
  APIErrorProps,
  membershipFormProps,
} from "../../../components/Utilities/Types/types";
import type { TFunction } from "i18next";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useEditMembershipMutation } from "../../../components/APIs/Membership/MEMBERSHIP_QUERY";

type addRoleProps = {
  open: boolean;
  close: () => void;
  t: TFunction;
  data: membershipFormProps;
};

const EditMembership = ({ open, close, t, data }: addRoleProps) => {
  const [editMembership, { isLoading }] = useEditMembershipMutation();

  // console.log(data);

  const defaultValues = {
    name: data?.name,
    code: data?.code,
    startDate: data?.startDate,
    endDate: data?.endDate,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<membershipFormProps>({
    defaultValues,
  });

  const handleReset = () => {
    reset();
    close();
  };

  const submitForm = async (values: membershipFormProps) => {
    const formatData = {
      ...values,
      id: data?.id,
      startDate: dayjs(values?.startDate)?.format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(values?.endDate)?.format("YYYY-MM-DDTHH:mm:ss"),
    };

    try {
      await editMembership(formatData).unwrap();
      toast.success("membership updated successfully");
      handleReset();
    } catch (error) {
      const err = error as APIErrorProps;
      if (
        err?.data?.isSuccess === false &&
        err?.data?.errorMessages &&
        err?.data?.errorMessages.length > 0
      ) {
        const errs =
          err?.data?.errorMessages && err?.data?.errorMessages.join("\n");

        toast.error(errs);
      } else {
        toast.error("Failed to update membership");
      }
    }
  };
  return (
    <div>
      <Modal
        title={t("EDIT_MEMBERSHIP")}
        closable={{ "aria-label": "Close Button" }}
        open={open}
        // onOk={handleOk}
        onCancel={handleReset}
        footer
      >
        <form noValidate onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 capitalize [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
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
              <label>{t("CODE")}</label>
              <Controller
                control={control}
                name="code"
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
                    placeholder="Enter membership code"
                    className="placeholder:capitalize"
                    status={errors?.code ? "error" : ""}
                  />
                )}
              />

              {errors?.code ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.code?.message}
                </p>
              ) : null}
            </div>

            <div>
              <label>{t("START_DATE")}</label>
              <Controller
                control={control}
                name="startDate"
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
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(e) => {
                      field.onChange(dayjs(e));
                    }}
                    status={errors?.startDate ? "error" : ""}
                  />
                )}
              />

              {errors?.startDate ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.startDate?.message}
                </p>
              ) : null}
            </div>

            <div>
              <label>{t("END_DATE")}</label>
              <Controller
                control={control}
                name="endDate"
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
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(e) => {
                      field.onChange(dayjs(e));
                    }}
                    status={errors?.endDate ? "error" : ""}
                  />
                )}
              />

              {errors?.endDate ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.endDate?.message}
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
              {t("UPDATE")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EditMembership;
