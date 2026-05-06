import { Button, DatePicker, InputNumber, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { workerManagementFormProps } from "../../../components/Utilities/Types/types";

export default function WorkerManagementForm({
  isAddModalOpen,
  closeAddModal,
  handleSubmit,
  handleAddDuration,
  control,
  errors,
  t,
  isAddDurationLoading,
}: {
  isAddModalOpen: boolean;
  closeAddModal: () => void;
  handleSubmit?: (
    callback: (data: workerManagementFormProps) => void,
  ) => (e: React.FormEvent<HTMLFormElement>) => void;
  handleAddDuration?: (data: workerManagementFormProps) => void;
  control?: Control<workerManagementFormProps>;
  errors?: FieldErrors<workerManagementFormProps>;
  t: TFunction;
  isAddDurationLoading: boolean;
}) {
  return (
    <Modal
      title={t("ADD_DURATION")}
      closable={{ "aria-label": "Custom Close Button" }}
      open={isAddModalOpen}
      onCancel={closeAddModal}
      footer={null}
    >
      {handleSubmit && handleAddDuration && control && errors && (
        <form
          onSubmit={handleSubmit(handleAddDuration)}
          className="mt-6 flex flex-col gap-4"
        >
          <section className="grid grid-cols-1 gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor [&>div>p]:capitalize [&>div>p]:text-red-500 [&>div>p]:text-xs">
            {/* Start Date */}
            <div>
              <label>{t("START_DATE")}</label>
              <Controller
                name="startDate"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                    variant="filled"
                    status={errors?.startDate ? "error" : ""}
                    placeholder={t("START_DATE")}
                    format="DD-MM-YYYY"
                    showTime={false}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) =>
                      field.onChange(
                        date ? date.startOf("day").toISOString() : "",
                      )
                    }
                  />
                )}
              />
              {errors.startDate?.message && <p>{errors.startDate?.message}</p>}
            </div>

            {/* End Date */}
            <div>
              <label>{t("END_DATE")}</label>
              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                    variant="filled"
                    status={errors?.endDate ? "error" : ""}
                    placeholder={t("END_DATE")}
                    format="DD-MM-YYYY"
                    showTime={false}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) =>
                      field.onChange(
                        date ? date.endOf("day").toISOString() : "",
                      )
                    }
                  />
                )}
              />
              {errors.endDate?.message && <p>{errors.endDate?.message}</p>}
            </div>

            {/* Worker No */}
            <div>
              <label>{t("WORKER_NO")}</label>
              <Controller
                name="workersNo"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                  min: {
                    value: 1,
                    message: t("MIN_WORKERS", { count: 1 }),
                  },
                }}
                render={({ field }) => (
                  <InputNumber
                    min={0}
                    {...field}
                    variant="filled"
                    placeholder={t("WORKER_NO")}
                    className="min-h-10 border-[#C4C4C4] border rounded-md placeholder:capitalize w-full"
                    status={errors?.workersNo ? "error" : ""}
                  />
                )}
              />
              {errors.workersNo?.message && <p>{errors.workersNo?.message}</p>}
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
              onClick={closeAddModal}
              className="bg-white text-gray-500 hover:bg-gray-600 hover:text-white hover:border-transparent"
            >
              {t("CANCEL")}
            </Button>

            <Button
              htmlType="submit"
              className="bg-mainColor/80 text-white hover:bg-mainColor disabled:bg-gray-400 disabled:text-white"
              loading={isAddDurationLoading}
            >
              {t("SUBMIT")}
            </Button>
          </section>
        </form>
      )}
    </Modal>
  );
}
