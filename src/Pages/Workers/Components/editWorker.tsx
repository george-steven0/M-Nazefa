import { Modal, Button, Input, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface EditWorkerProps {
  open: boolean;
  close: () => void;
  id: string | number;
}

interface WorkerFormProps {
  name: string;
  phoneNumber: string;
  nationalId: string;
  gender: string;
}

const EditWorker = ({ open, close }: EditWorkerProps) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkerFormProps>();

  const onSubmit = (data: WorkerFormProps) => {
    console.log(data);
    reset();
    close();
  };

  const handleClose = () => {
    close();
  };

  return (
    <Modal
      title={<div className="text-xl capitalize mb-6">{t("EDIT_WORKER")}</div>}
      open={open}
      onCancel={close}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium  [&>div>input]:border-[#C4C4C4] [&>div>input]:placeholder:capitalize [&>div>input]:py-2  [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium capitalize">
              {t("NAME")}
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: t("REQUIRED") }}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="filled"
                  status={errors.name ? "error" : ""}
                  placeholder={t("NAME")}
                  className="py-2"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-medium capitalize">
              {t("PHONE_NUMBER")}
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: t("REQUIRED") }}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="filled"
                  status={errors.phoneNumber ? "error" : ""}
                  placeholder={t("PHONE_NUMBER")}
                  className="py-2"
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* National ID */}
          <div>
            <label className="block mb-1 font-medium capitalize">
              {t("ID_NUMBER")}
            </label>
            <Controller
              name="nationalId"
              control={control}
              rules={{ required: t("REQUIRED") }}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="filled"
                  status={errors.nationalId ? "error" : ""}
                  placeholder={t("ID_NUMBER")}
                  className="py-2"
                />
              )}
            />
            {errors.nationalId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nationalId.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium capitalize">
              {t("GENDER")}
            </label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: t("REQUIRED") }}
              render={({ field }) => (
                <Select
                  {...field}
                  variant="filled"
                  status={errors.gender ? "error" : ""}
                  placeholder={t("GENDER")}
                  className="w-full h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                  options={[
                    { value: "male", label: t("MALE") },
                    { value: "female", label: t("FEMALE") },
                  ]}
                />
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 gap-2">
          <Button onClick={handleClose} className="capitalize">
            {t("CLOSE")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-mainColor capitalize"
          >
            {t("SUBMIT")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditWorker;
