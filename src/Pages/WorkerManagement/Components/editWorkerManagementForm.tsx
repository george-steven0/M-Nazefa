import { Button, InputNumber, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type {
  APIErrorProps,
  workerManagementEditProps,
  workerManagementResponseProps,
} from "../../../components/Utilities/Types/types";
import { useEditWorkerManagementMutation } from "../../../components/APIs/WorkerManagement/WORKER_MANAGEMENT_QUERY";

type EditFormValues = {
  availableNoWorkers: number;
  remainNoOfWorkers: number;
  notes?: string;
};

export default function EditWorkerManagementForm({
  open,
  close,
  record,
}: {
  open: boolean;
  close: () => void;
  record?: workerManagementResponseProps | null;
}) {
  const { t } = useTranslation();

  const [editWorkerManagement, { isLoading }] =
    useEditWorkerManagementMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    defaultValues: {
      availableNoWorkers: 0,
      remainNoOfWorkers: 0,
      notes: "",
    },
  });

  // Sync form with the selected record whenever the modal opens
  useEffect(() => {
    if (open && record) {
      reset({
        availableNoWorkers: record.availableNoWorkers ?? 0,
        remainNoOfWorkers: record.remainNoOfWorkers ?? 0,
        notes: record.notes ?? "",
      });
    }
  }, [open, record, reset]);

  const handleClose = () => {
    close();
    reset();
  };

  const onSubmit = async (values: EditFormValues) => {
    if (!record?.id && record?.id !== 0) return;

    const payload: workerManagementEditProps = {
      id: record.id,
      availableNoWorkers: values.availableNoWorkers,
      remainNoOfWorkers: values.remainNoOfWorkers,
      notes: values.notes,
    };

    try {
      await editWorkerManagement(payload).unwrap();
      toast.success(t("WORKER_MANAGEMENT_UPDATED_SUCCESS"));
      handleClose();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };

  return (
    <Modal
      title={t("EDIT_WORKER_MANAGEMENT")}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <section className="grid grid-cols-1 gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor [&>div>p]:capitalize [&>div>p]:text-red-500 [&>div>p]:text-xs">
          {/* Available workers */}
          <div>
            <label>{t("AVAILABLE_WORKERS")}</label>
            <Controller
              name="availableNoWorkers"
              control={control}
              rules={{
                required: { value: true, message: t("REQUIRED") },
                min: { value: 0, message: t("REQUIRED") },
              }}
              render={({ field }) => (
                <InputNumber
                  min={0}
                  {...field}
                  variant="filled"
                  placeholder={t("AVAILABLE_WORKERS")}
                  className="min-h-10 border-[#C4C4C4] border rounded-md placeholder:capitalize w-full"
                  status={errors?.availableNoWorkers ? "error" : ""}
                />
              )}
            />
            {errors.availableNoWorkers?.message && (
              <p>{errors.availableNoWorkers?.message}</p>
            )}
          </div>

          {/* Remaining workers */}
          <div>
            <label>{t("REMAIN_WORKERS")}</label>
            <Controller
              name="remainNoOfWorkers"
              control={control}
              rules={{
                required: { value: true, message: t("REQUIRED") },
                min: { value: 0, message: t("REQUIRED") },
              }}
              render={({ field }) => (
                <InputNumber
                  min={0}
                  {...field}
                  variant="filled"
                  placeholder={t("REMAIN_WORKERS")}
                  className="min-h-10 border-[#C4C4C4] border rounded-md placeholder:capitalize w-full"
                  status={errors?.remainNoOfWorkers ? "error" : ""}
                />
              )}
            />
            {errors.remainNoOfWorkers?.message && (
              <p>{errors.remainNoOfWorkers?.message}</p>
            )}
          </div>

          {/* Notes (optional) */}
          <div>
            <label>{t("NOTES")}</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  variant="filled"
                  placeholder={t("NOTES")}
                  className="placeholder:capitalize"
                  rows={4}
                />
              )}
            />
          </div>
        </section>

        <section className="flex gap-4 justify-end mt-4 [&>button]:min-w-[140px] [&>button]:min-h-10 [&>button]:py-2 [&>button]:capitalize">
          <Button
            onClick={handleClose}
            className="bg-white text-gray-500 hover:bg-gray-600 hover:text-white hover:border-transparent"
          >
            {t("CANCEL")}
          </Button>

          <Button
            htmlType="submit"
            className="bg-mainColor/80 text-white hover:bg-mainColor disabled:bg-gray-400 disabled:text-white"
            loading={isLoading}
          >
            {t("SUBMIT")}
          </Button>
        </section>
      </form>
    </Modal>
  );
}
