import { useTranslation } from "react-i18next";
import { Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetComplaintByIdQuery } from "../../../components/APIs/Complaints/COMPLAINT_QUERY";

type ViewComplaintProps = {
  open: boolean;
  onClose: () => void;
  complaintId: string | null;
};

const ViewComplaint = ({ open, onClose, complaintId }: ViewComplaintProps) => {
  const { t } = useTranslation();

  const {
    data: complaintDetails,
    isLoading: complaintDetailsLoading,
    isFetching: complaintDetailsFetching,
  } = useGetComplaintByIdQuery(
    complaintId ? { id: complaintId } : skipToken,
  );

  return (
    <Modal
      title={t("VIEW_COMPLAINT")}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={onClose}
      footer={null}
      loading={complaintDetailsLoading || complaintDetailsFetching}
    >
      <div className="mt-6 flex flex-col gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor">
        <div>
          <label>{t("RESERVATION_ID")}</label>
          <Input
            variant="filled"
            value={complaintDetails?.data?.reservationId?.toString() || ""}
            readOnly
          />
        </div>

        <div>
          <label>{t("COMMENT")}</label>
          <TextArea
            variant="filled"
            value={complaintDetails?.data?.comment || ""}
            readOnly
            rows={4}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewComplaint;
