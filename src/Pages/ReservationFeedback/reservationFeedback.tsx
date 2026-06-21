import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import {
  Button,
  Input,
  Modal,
  Rate,
  Select,
  type TablePaginationConfig,
  type TableProps,
} from "antd";
import type {
  APIErrorProps,
  feedbackFormProps,
  feedbackResponseProps,
} from "../../components/Utilities/Types/types";
import {
  useAddReservationFeedbackMutation,
  useGetAllReservationFeedbacksQuery,
  useGetReservationFeedbackByIdQuery,
} from "../../components/APIs/ReservationFeedback/RESERVATION_FEEDBACK_QUERY";
import { useGetAllReservationsQuery } from "../../components/APIs/Reservations/RESERVATION_QUERY";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai";
import { skipToken } from "@reduxjs/toolkit/query";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import useCustomDataTable from "../../components/Common/Datatable/dataTable";

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

  // Only fetch reservations while the add modal is open
  const {
    data: reservations,
    isLoading: reservationsLoading,
    isFetching: reservationsIsFetching,
  } = useGetAllReservationsQuery(isAddModalOpen ? undefined : skipToken);

  const {
    data: feedbackDetails,
    isLoading: feedbackDetailsLoading,
    isFetching: feedbackDetailsFetching,
  } = useGetReservationFeedbackByIdQuery(
    selectedFeedbackId ? { id: selectedFeedbackId } : skipToken,
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

  // ── Search ─────────────────────────────────────────────────────────────────
  const { SearchBox } = useSearchBox({
    placeholder: t("SEARCH_FEEDBACK"),
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAddModal = () => {
    reset({ reservationId: "", rate: 0, comment: "" });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    reset();
  };

  const openViewModal = (id: string) => {
    setSelectedFeedbackId(id);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedFeedbackId(null);
  };

  const handleAddFeedback = async (data: feedbackFormProps) => {
    try {
      await addFeedback(data).unwrap();
      toast.success(t("FEEDBACK_ADDED_SUCCESS"));
      closeAddModal();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };

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

      {/* ── Add Feedback Modal ───────────────────────────────────────────── */}
      <Modal
        title={t("ADD_FEEDBACK")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isAddModalOpen}
        onCancel={closeAddModal}
        footer={null}
      >
        <form
          onSubmit={handleSubmit(handleAddFeedback)}
          className="mt-6 flex flex-col gap-4"
        >
          <section className="grid grid-cols-1 gap-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div>label]:block [&>div>label]:font-semibold [&>div>label]:text-sm [&>div>label]:text-mainColor [&>div>p]:capitalize [&>div>p]:text-red-500 [&>div>p]:text-xs">
            <div>
              <label>{t("RESERVATION_ID")}</label>
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
                      label: `#${reservation.id} - ${reservation.customerName || reservation.name || reservation.id}`,
                    }))}
                  />
                )}
              />
              {errors.reservationId?.message && (
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
              onClick={closeAddModal}
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

      {/* ── View Feedback Modal ──────────────────────────────────────────── */}
      <Modal
        title={t("VIEW_FEEDBACK")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isViewModalOpen}
        onCancel={closeViewModal}
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
    </main>
  );
};

export default ReservationFeedback;
