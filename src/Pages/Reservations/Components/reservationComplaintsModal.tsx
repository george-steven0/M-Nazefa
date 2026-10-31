import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import dayjs from "dayjs";
import { BsBoxSeam } from "react-icons/bs";
import { useGetComplaintsByReservationQuery } from "../../../components/APIs/Complaints/COMPLAINT_QUERY";
import { useAppSelector } from "../../../components/APIs/store";

type ReservationComplaintsModalProps = {
  open: boolean;
  onClose: () => void;
  reservationId: string | number | null;
};

const ReservationComplaintsModal = ({
  open,
  onClose,
  reservationId,
}: ReservationComplaintsModalProps) => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state?.lang);

  const {
    data: complaints,
    isLoading,
    isFetching,
  } = useGetComplaintsByReservationQuery(
    open && reservationId ? { reservationId } : skipToken,
  );

  const data = complaints?.data || [];

  return (
    <Modal
      title={`${t("RESERVATION_COMPLAINTS")} #${reservationId ?? ""}`}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={onClose}
      footer={null}
      loading={isLoading || isFetching}
    >
      <div className="mt-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
        {data.length !== 0 ? (
          data.map((complaint) => (
            <section
              key={complaint.id}
              className="flex flex-col gap-2 rounded-md border border-gray-200 p-4"
            >
              <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-500">
                <span>
                  <span className="font-semibold text-mainColor">
                    {t("CREATED_BY")} :{" "}
                  </span>
                  {complaint.createdByName || t("NA")}
                </span>
                <span>
                  {complaint.creationDate
                    ? dayjs(complaint.creationDate).format("DD-MM-YYYY hh:mm A")
                    : t("NA")}
                </span>
              </div>

              <p className="whitespace-pre-wrap text-gray-700">
                {complaint.comment || t("NA")}
              </p>

              {complaint.workers && complaint.workers.length !== 0 && (
                <div className="flex flex-wrap gap-4">
                  {complaint.workers.map((worker) => (
                    <div key={worker.workerId} className="flex gap-2">
                      <span className="w-[3px] h-6 bg-mainOrange rounded-full" />
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-600">
                          {t("WORKER")} :{" "}
                        </span>
                        <span className="text-gray-500">
                          {lang === "ar"
                            ? worker.workerArName
                            : worker.workerName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))
        ) : (
          <p className="flex items-center gap-2 justify-center w-full text-gray-300 capitalize">
            <BsBoxSeam size={20} />
            <span>{t("NO_COMPLAINTS")}</span>
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ReservationComplaintsModal;
