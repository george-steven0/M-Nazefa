import { Button, DatePicker, InputNumber, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  useAddWalletOpeningBalanceMutation,
  useAddWalletTransactionMutation,
} from "../../../components/APIs/CustomerWallet/CUSTOMER_WALLET_QUERY";
import { handleApiError } from "../../../components/Utilities/helper";
import type { walletTransactionFormProps } from "../../../components/Utilities/Types/types";

export type walletModalMode = "opening" | "transaction";

type WalletTransactionModalProps = {
  open: boolean;
  mode: walletModalMode;
  customerId: string | number;
  onClose: () => void;
};

const WalletTransactionModal = ({
  open,
  mode,
  customerId,
  onClose,
}: WalletTransactionModalProps) => {
  const { t } = useTranslation();
  const isOpening = mode === "opening";

  const [addOpeningBalance, { isLoading: isOpeningLoading }] =
    useAddWalletOpeningBalanceMutation();
  const [addTransaction, { isLoading: isTransactionLoading }] =
    useAddWalletTransactionMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<walletTransactionFormProps>({
    defaultValues: {
      customerId,
      type: undefined,
      amount: null,
      transactionDate: "",
      description: "",
    },
  });

  const type = useWatch({ control, name: "type" });

  // Fresh form every time the modal opens; date defaults to now
  useEffect(() => {
    if (open) {
      reset({
        customerId,
        type: isOpening ? undefined : "Deposit",
        amount: null,
        transactionDate: dayjs().toISOString(),
        description: "",
      });
    }
  }, [open, isOpening, customerId, reset]);

  const onSubmit = async (values: walletTransactionFormProps) => {
    const payload: walletTransactionFormProps = {
      ...values,
      customerId: Number(customerId),
      // Local wall-clock time (backend works in Egypt local time)
      transactionDate: dayjs(values.transactionDate).format("YYYY-MM-DDTHH:mm:ss"),
    };

    try {
      if (isOpening) {
        await addOpeningBalance(payload).unwrap();
      } else {
        await addTransaction(payload).unwrap();
      }
      toast.success(t("WALLET_TRANSACTION_ADDED_SUCCESS"));
      onClose();
    } catch (error) {
      handleApiError(error, t("WALLET_TRANSACTION_ADD_FAILED"));
    }
  };

  return (
    <Modal
      title={t(isOpening ? "ADD_OPENING_BALANCE" : "ADD_WALLET_TRANSACTION")}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <section className="grid grid-cols-1 gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor [&>div>p]:capitalize [&>div>p]:text-red-500 [&>div>p]:text-xs">
          {/* Type (manual transactions only) */}
          {!isOpening && (
            <div>
              <label>{t("TYPE")}</label>
              <Controller
                name="type"
                control={control}
                rules={{ required: { value: true, message: t("REQUIRED") } }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={t("TYPE")}
                    className="min-h-10 w-full"
                    status={errors?.type ? "error" : ""}
                    options={[
                      { value: "Deposit", label: t("WALLET_TYPE_DEPOSIT") },
                      { value: "CashBack", label: t("WALLET_TYPE_CASHBACK") },
                      { value: "Adjustment", label: t("WALLET_TYPE_ADJUSTMENT") },
                    ]}
                  />
                )}
              />
              {errors.type?.message && <p>{errors.type?.message}</p>}
            </div>
          )}

          {/* Amount: only an adjustment can be negative (takes money out) */}
          <div>
            <label>{t("AMOUNT")}</label>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: { value: true, message: t("REQUIRED") },
                validate: (value) => {
                  const amount = Number(value);
                  if (!amount) return t("WALLET_AMOUNT_NOT_ZERO");
                  if (type !== "Adjustment" && amount < 0)
                    return t("WALLET_AMOUNT_POSITIVE");
                  return true;
                },
              }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={!isOpening && type === "Adjustment" ? undefined : 0}
                  variant="filled"
                  placeholder={t("AMOUNT")}
                  className="min-h-10 border-[#C4C4C4] border rounded-md placeholder:capitalize w-full"
                  status={errors?.amount ? "error" : ""}
                />
              )}
            />
            {!isOpening && type === "Adjustment" && (
              <span className="text-xs text-gray-400">
                {t("WALLET_ADJUSTMENT_HINT")}
              </span>
            )}
            {errors.amount?.message && <p>{errors.amount?.message}</p>}
          </div>

          {/* Transaction date */}
          <div>
            <label>{t("TRANSACTION_DATE")}</label>
            <Controller
              name="transactionDate"
              control={control}
              rules={{ required: { value: true, message: t("REQUIRED") } }}
              render={({ field }) => (
                <DatePicker
                  className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                  variant="filled"
                  status={errors?.transactionDate ? "error" : ""}
                  placeholder={t("TRANSACTION_DATE")}
                  format="DD-MM-YYYY hh:mm A"
                  showTime
                  showNow
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.toISOString() : "")}
                />
              )}
            />
            {errors.transactionDate?.message && (
              <p>{errors.transactionDate?.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label>{t("DESCRIPTION")}</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  variant="filled"
                  placeholder={t("DESCRIPTION")}
                  className="placeholder:capitalize"
                  rows={3}
                  maxLength={500}
                />
              )}
            />
          </div>
        </section>

        <section className="flex gap-4 justify-end mt-4 [&>button]:min-w-[140px] [&>button]:min-h-10 [&>button]:py-2 [&>button]:capitalize">
          <Button
            onClick={onClose}
            className="bg-white text-gray-500 hover:bg-gray-600 hover:text-white hover:border-transparent"
          >
            {t("CANCEL")}
          </Button>
          <Button
            htmlType="submit"
            className="bg-mainColor/80 text-white hover:bg-mainColor disabled:bg-gray-400 disabled:text-white"
            loading={isOpeningLoading || isTransactionLoading}
          >
            {t("SUBMIT")}
          </Button>
        </section>
      </form>
    </Modal>
  );
};

export default WalletTransactionModal;
