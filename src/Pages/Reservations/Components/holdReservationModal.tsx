import { Button, DatePicker, Modal } from "antd";
import type { TFunction } from "i18next";
import type { holdReservationProps } from "../../../components/Utilities/Types/types";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
} from "react-hook-form";
import dayjs from "dayjs";

type holdReservationPropsType = {
  open: boolean;
  close: () => void;
  loading: boolean;
  t: TFunction;
  control: Control<holdReservationProps>;
  handleSubmit: UseFormHandleSubmit<holdReservationProps>;
  submitFunction: (data: holdReservationProps) => void;
  errors: FieldErrors<holdReservationProps>;
  isDirty: boolean;
};
export default function HoldReservationModal({
  open,
  close,
  loading,
  t,
  control,
  handleSubmit,
  submitFunction,
  errors,
  isDirty,
}: holdReservationPropsType) {
  return (
    <div>
      <Modal
        title={t("AVAILABLE_APPOINTMENTS")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={open}
        // onOk={close}
        onCancel={close}
        footer={null}
        loading={loading}
      >
        <form
          onSubmit={handleSubmit(submitFunction)}
          className="mt-6 flex flex-col gap-4"
        >
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor [&>div>p]:capitalize [&>div>p]:text-red-500 [&>div>p]:text-xs">
            <div>
              <label>{t("DATE_FROM")}</label>
              <Controller
                name="dateFrom"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    format="DD-MM-YYYY"
                    //   showTime
                    showNow
                    placeholder="Select Date"
                  />
                )}
              />
              {errors.dateFrom?.message && <p>{errors.dateFrom?.message}</p>}
            </div>

            <div>
              <label>{t("DATE_TO")}</label>
              <Controller
                name="dateTo"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <>
                    <DatePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      format="DD-MM-YYYY"
                      //   showTime
                      showNow
                      placeholder="Select Date"
                    />

                    {/* {console.log(field.value)} */}
                  </>
                )}
              />
              {errors.dateTo?.message && <p>{errors.dateTo?.message}</p>}
            </div>
          </section>

          <section className="flex gap-4 justify-end mt-4 [&>button]:min-w-[140px] [&>button]:min-h-10 [&>button]:py-2 [&>button]:capitalize">
            <Button
              onClick={close}
              className="bg-white text-gray-500 hover:bg-gray-600 hover:text-white hover:border-transparent"
            >
              {t("CANCEL")}
            </Button>

            <Button
              htmlType="submit"
              className="bg-mainColor/80 text-white hover:bg-mainColor disabled:bg-gray-400 disabled:text-white"
              loading={loading}
              disabled={!isDirty}
            >
              {t("SUBMIT")}
            </Button>
          </section>
        </form>
      </Modal>
    </div>
  );
}
