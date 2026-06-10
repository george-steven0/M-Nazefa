import { Button, DatePicker, InputNumber, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
} from "react-hook-form";
import type { reservationPaymentsProps } from "../../../components/Utilities/Types/types";

type addPaymentModalProps = {
  open: boolean;
  close: () => void;
  t: TFunction;
  control: Control<reservationPaymentsProps>;
  handleSubmit: UseFormHandleSubmit<reservationPaymentsProps>;
  submitFunction: (data: reservationPaymentsProps) => void;
  errors: FieldErrors<reservationPaymentsProps>;
  loading: boolean;
  paymentMethods?: string[];
  methodsLoading?: boolean;
};

export default function AddPaymentModal({
  open,
  close,
  t,
  control,
  handleSubmit,
  submitFunction,
  errors,
  loading,
  paymentMethods,
  methodsLoading,
}: addPaymentModalProps) {
  const paymentMethodOptions = paymentMethods?.map((method) => ({
    value: method,
    label: method,
  }));

  return (
    <Modal
      title={t("ADD_PAYMENT")}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={close}
      footer={null}
      destroyOnClose
    >
      <form
        onSubmit={handleSubmit(submitFunction)}
        className="mt-6 flex flex-col gap-4"
      >
        <section className="grid grid-cols-1 gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor [&>div>p]:capitalize [&>div>p]:text-red-500 [&>div>p]:text-xs">
          {/* Payment Method */}
          <div>
            <label>{t("PAYMENT_METHOD")}</label>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{
                required: { value: true, message: t("REQUIRED") },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={t("SELECT_PAYMENT_METHOD")}
                  className="min-h-10 w-full"
                  options={paymentMethodOptions}
                  loading={methodsLoading}
                  disabled={methodsLoading}
                  status={errors?.paymentMethod ? "error" : ""}
                  allowClear
                />
              )}
            />
            {errors.paymentMethod?.message && (
              <p>{errors.paymentMethod?.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label>{t("AMOUNT")}</label>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: { value: true, message: t("REQUIRED") },
                min: { value: 1, message: t("REQUIRED") },
              }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  variant="filled"
                  placeholder={t("AMOUNT")}
                  className="min-h-10 border-[#C4C4C4] border rounded-md placeholder:capitalize w-full"
                  status={errors?.amount ? "error" : ""}
                />
              )}
            />
            {errors.amount?.message && <p>{errors.amount?.message}</p>}
          </div>

          {/* Operation Date */}
          <div>
            <label>{t("OPERATION_DATE")}</label>
            <Controller
              name="operationDate"
              control={control}
              rules={{
                required: { value: true, message: t("REQUIRED") },
              }}
              render={({ field }) => (
                <DatePicker
                  className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                  variant="filled"
                  status={errors?.operationDate ? "error" : ""}
                  placeholder={t("OPERATION_DATE")}
                  format="DD-MM-YYYY hh:mm A"
                  showTime
                  showNow
                  showWeek
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : "")
                  }
                />
              )}
            />
            {errors.operationDate?.message && (
              <p>{errors.operationDate?.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label>{t("TYPE")}</label>
            <Controller
              name="type"
              control={control}
              rules={{
                required: { value: true, message: t("REQUIRED") },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={t("TYPE")}
                  className="min-h-10 w-full"
                  status={errors?.type ? "error" : ""}
                  options={[
                    { value: "Pay", label: t("PAYMENT") },
                    { value: "Refund", label: t("REFUND") },
                  ]}
                  allowClear
                />
              )}
            />
            {errors.type?.message && <p>{errors.type?.message}</p>}
          </div>

          {/* Notes */}
          <div>
            <label>{t("NOTES")}</label>
            <Controller
              name="note"
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
            onClick={close}
            className="bg-white text-gray-500 hover:bg-gray-600 hover:text-white hover:border-transparent"
          >
            {t("CANCEL")}
          </Button>

          <Button
            htmlType="submit"
            className="bg-mainColor/80 text-white hover:bg-mainColor disabled:bg-gray-400 disabled:text-white"
            loading={loading}
          >
            {t("SUBMIT")}
          </Button>
        </section>
      </form>
    </Modal>
  );
}
