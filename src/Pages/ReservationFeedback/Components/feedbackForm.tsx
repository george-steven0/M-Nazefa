import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, Modal, Rate, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { skipToken } from "@reduxjs/toolkit/query";
import type {
  APIErrorProps,
  feedbackFormProps,
} from "../../../components/Utilities/Types/types";
import { useAddReservationFeedbackMutation } from "../../../components/APIs/ReservationFeedback/RESERVATION_FEEDBACK_QUERY";
import { useGetReservationListDDLQuery } from "../../../components/APIs/Seeders/SEEDERS_RTK_QUERY";

type FeedbackFormProps = {
  open: boolean;
  onClose: () => void;
  /** When provided, the reservation is fixed (shown read-only) instead of picked from a list */
  reservationId?: string | number | null;
};

const FeedbackForm = ({ open, onClose, reservationId }: FeedbackFormProps) => {
  const { t } = useTranslation();

  // ── Queries ────────────────────────────────────────────────────────────────
  // Only fetch reservations while the modal is open and no fixed reservation is provided
  const {
    data: reservations,
    isLoading: reservationsLoading,
    isFetching: reservationsIsFetching,
  } = useGetReservationListDDLQuery(
    open && reservationId == null ? undefined : skipToken,
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [addFeedback, { isLoading: isAddFeedbackLoading }] =
    useAddReservationFeedbackMutation();

  // ── Form ───────────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<feedbackFormProps>({
    defaultValues: {
      reservationId: "",
      rate: 0,
      comment: "",
    },
  });

  // Reset to a clean form each time the modal is opened
  useEffect(() => {
    if (open) {
      reset({ reservationId: reservationId ?? "", rate: 0, comment: "" });
    }
  }, [open, reservationId, reset]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAddFeedback = async (data: feedbackFormProps) => {
    try {
      await addFeedback(data).unwrap();
      toast.success(t("FEEDBACK_ADDED_SUCCESS"));
      onClose();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };

  return (
    <Modal
      title={t("ADD_FEEDBACK")}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <form
        onSubmit={handleSubmit(handleAddFeedback)}
        className="mt-6 flex flex-col gap-4"
      >
        <section className="grid grid-cols-1 gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor [&>div>p]:capitalize [&>div>p]:text-red-500 [&>div>p]:text-xs">
          <div>
            <label>{t("RESERVATION_ID")}</label>
            {reservationId != null ? (
              <Input
                variant="filled"
                value={reservationId.toString()}
                readOnly
              />
            ) : (
              <Controller
                name="reservationId"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    loading={reservationsLoading || reservationsIsFetching}
                    className="min-h-10 border-[#C4C4C4] border rounded-md [&>.ant-select-selector]:capitalize"
                    variant="filled"
                    status={errors?.reservationId ? "error" : ""}
                    placeholder={t("SELECT_RESERVATION")}
                    style={{ width: "100%" }}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={reservations?.data?.map((reservation) => ({
                      value: reservation.id,
                      label: `${reservation.name || reservation.arName || reservation.id}`,
                    }))}
                  />
                )}
              />
            )}
            {reservationId == null && errors.reservationId?.message && (
              <p>{errors.reservationId?.message}</p>
            )}
          </div>

          <div>
            <label>{t("RATE")}</label>
            <Controller
              name="rate"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t("REQUIRED"),
                },
                min: {
                  value: 1,
                  message: t("REQUIRED"),
                },
              }}
              render={({ field }) => <Rate {...field} />}
            />
            {errors.rate?.message && <p>{errors.rate?.message}</p>}
          </div>

          <div>
            <label>{t("COMMENT")}</label>
            <Controller
              name="comment"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t("REQUIRED"),
                },
              }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  variant="filled"
                  placeholder={t("COMMENT")}
                  className="placeholder:capitalize"
                  status={errors?.comment ? "error" : ""}
                  rows={4}
                />
              )}
            />
            {errors.comment?.message && <p>{errors.comment?.message}</p>}
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
            loading={isAddFeedbackLoading}
          >
            {t("SUBMIT")}
          </Button>
        </section>
      </form>
    </Modal>
  );
};

export default FeedbackForm;
