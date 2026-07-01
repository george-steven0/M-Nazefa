import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import {
  Button,
  Rate,
  type TablePaginationConfig,
  type TableProps,
} from "antd";
import type { feedbackResponseProps } from "../../components/Utilities/Types/types";
import { useGetAllReservationFeedbacksQuery } from "../../components/APIs/ReservationFeedback/RESERVATION_FEEDBACK_QUERY";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import dayjs from "dayjs";
import useCustomDataTable from "../../components/Common/Datatable/dataTable";
import FeedbackForm from "./Components/feedbackForm";
import ViewFeedback from "./Components/viewFeedback";

const ReservationFeedback = () => {
  const { t } = useTranslation();

  // ── State ──────────────────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null,
  );

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // ── Queries ────────────────────────────────────────────────────────────────
  const {
    data: feedbacks,
    isLoading,
    isFetching,
  } = useGetAllReservationFeedbacksQuery();

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openViewModal = (id: string) => {
    setSelectedFeedbackId(id);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedFeedbackId(null);
  };

  // ── Search ─────────────────────────────────────────────────────────────────
  const { SearchBox } = useSearchBox({
    placeholder: t("SEARCH_FEEDBACK"),
  });

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: TableProps<feedbackResponseProps>["columns"] = [
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("RESERVATION_ID"),
      dataIndex: "reservationId",
      key: "reservationId",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("RATE"),
      dataIndex: "rate",
      key: "rate",
      render: (rate) => <Rate disabled value={Number(rate) || 0} />,
    },
    {
      title: t("COMMENT"),
      dataIndex: "comment",
      key: "comment",
      render: (text) => (
        <p className="max-w-[300px] truncate">{text || t("NA")}</p>
      ),
    },
    {
      title: t("CREATED_BY"),
      dataIndex: "createdByName",
      key: "createdByName",
      render: (text) => <p>{text || t("NA")}</p>,
    },
    {
      title: t("CREATION_DATE"),
      dataIndex: "creationDate",
      key: "creationDate",
      render: (text) => (
        <span>{text ? dayjs(text).format("DD-MM-YYYY hh:mm A") : t("NA")}</span>
      ),
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      render: (row) => (
        <Button
          className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
          shape="circle"
          onClick={() => openViewModal(row?.id?.toString())}
          icon={<AiOutlineEye size={20} />}
        />
      ),
    },
  ];

  const data: feedbackResponseProps[] = feedbacks?.data || [];

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? 10,
    });
  };

  const { renderDataTable } = useCustomDataTable({
    cols: columns,
    data: data ?? [],
    isLoading: isLoading || isFetching,
    total: feedbacks?.paginationHeader?.totalItems ?? data.length,
    pagination,
    onChange: handleTableChange,
  });

  // ── Title component ────────────────────────────────────────────────────────
  const handleTitleComponent = () => {
    return (
      <div className="flex gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
        <Button onClick={openAddModal} className="text-white bg-mainColor ">
          {t("ADD_FEEDBACK")}
        </Button>
      </div>
    );
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <main>
      <header>
        <Title title={t("FEEDBACKS")} component={handleTitleComponent()} />
      </header>

      <div>
        <section className="my-8 max-w-[80%] lg:max-w-[40%]">
          {SearchBox()}
        </section>

        <section className="mt-8 overflow-x-auto">{renderDataTable()}</section>
      </div>

      <FeedbackForm open={isAddModalOpen} onClose={closeAddModal} />

      <ViewFeedback
        open={isViewModalOpen}
        onClose={closeViewModal}
        feedbackId={selectedFeedbackId}
      />
    </main>
  );
};

export default ReservationFeedback;
