import { useTranslation } from "react-i18next";
import { Input, Modal, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetReservationFeedbackByIdQuery } from "../../../components/APIs/ReservationFeedback/RESERVATION_FEEDBACK_QUERY";

type ViewFeedbackProps = {
  open: boolean;
  onClose: () => void;
  feedbackId: string | null;
};

const ViewFeedback = ({ open, onClose, feedbackId }: ViewFeedbackProps) => {
  const { t } = useTranslation();

  const {
    data: feedbackDetails,
    isLoading: feedbackDetailsLoading,
    isFetching: feedbackDetailsFetching,
  } = useGetReservationFeedbackByIdQuery(
    feedbackId ? { id: feedbackId } : skipToken,
  );

  return (
    <Modal
      title={t("VIEW_FEEDBACK")}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={onClose}
      footer={null}
      loading={feedbackDetailsLoading || feedbackDetailsFetching}
    >
      <div className="mt-6 flex flex-col gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor">
        <div>
          <label>{t("RESERVATION_ID")}</label>
          <Input
            variant="filled"
            value={feedbackDetails?.data?.reservationId?.toString() || ""}
            readOnly
          />
        </div>

        <div>
          <label>{t("RATE")}</label>
          <Rate disabled value={Number(feedbackDetails?.data?.rate) || 0} />
        </div>

        <div>
          <label>{t("COMMENT")}</label>
          <TextArea
            variant="filled"
            value={feedbackDetails?.data?.comment || ""}
            readOnly
            rows={4}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewFeedback;
