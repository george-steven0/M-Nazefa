import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useCancelReservationMutation } from "../../../components/APIs/Reservations/RESERVATION_QUERY";
import { handleApiError } from "../../../components/Utilities/helper";

type CancelReservationModalProps = {
  open: boolean;
  reservationId: string | number | null;
  /** Net paid; it is returned to the customer's wallet on cancel */
  paidAmount?: number;
  onClose: () => void;
  onCancelled?: () => void;
};

/** The only place in the UI that cancels a reservation (admins only). */
const CancelReservationModal = ({
  open,
  reservationId,
  paidAmount,
  onClose,
  onCancelled,
}: CancelReservationModalProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [cancelReservation, { isLoading }] = useCancelReservationMutation();

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const handleConfirm = async () => {
    if (!reservationId) return;
    try {
      await cancelReservation({
        reservationId: Number(reservationId),
        cancelReason: reason.trim() || null,
      }).unwrap();
      toast.success(t("RESERVATION_CANCELLED_SUCCESS"));
      onCancelled?.();
      onClose();
    } catch (error) {
      handleApiError(error, t("RESERVATION_CANCEL_FAILED"));
    }
  };

  return (
    <Modal
      open={open}
      title={`${t("CANCEL_RESERVATION")} #${reservationId ?? ""}`}
      onCancel={onClose}
      onOk={handleConfirm}
      okText={t("CONFIRM_CANCEL_RESERVATION")}
      cancelText={t("BACK")}
      okButtonProps={{ danger: true, loading: isLoading }}
      destroyOnClose
    >
      <div className="mt-4 flex flex-col gap-4">
        <p className="text-gray-700">
          {Number(paidAmount) > 0
            ? t("CANCEL_RESERVATION_WALLET_REFUND", { amount: paidAmount })
            : t("CANCEL_RESERVATION_NO_REFUND")}
        </p>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm text-mainColor">
            {t("CANCEL_REASON")}
          </label>
          <TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("CANCEL_REASON_PLACEHOLDER")}
            maxLength={500}
            rows={3}
            variant="filled"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CancelReservationModal;
