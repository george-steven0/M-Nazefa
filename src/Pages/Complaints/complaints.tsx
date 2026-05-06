import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { Button, Input, Modal, Select, Table, type TableProps } from "antd";
import type {
  APIErrorProps,
  complaintFormProps,
  complaintResponseProps,
} from "../../components/Utilities/Types/types";
import {
  useAddComplaintMutation,
  useGetAllComplaintsQuery,
  useGetComplaintByIdQuery,
} from "../../components/APIs/Complaints/COMPLAINT_QUERY";
import { useGetAllReservationsQuery } from "../../components/APIs/Reservations/RESERVATION_QUERY";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai";
import { skipToken } from "@reduxjs/toolkit/query";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const Complaints = () => {
  const { t } = useTranslation();

  // ── State ──────────────────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    null,
  );

  // ── Queries ────────────────────────────────────────────────────────────────
  const {
    data: complaints,
    isLoading,
    isFetching,
  } = useGetAllComplaintsQuery();

  const {
    data: reservations,
    isLoading: reservationsLoading,
    isFetching: reservationsIsFetching,
  } = useGetAllReservationsQuery();

  const {
    data: complaintDetails,
    isLoading: complaintDetailsLoading,
    isFetching: complaintDetailsFetching,
  } = useGetComplaintByIdQuery(
    selectedComplaintId ? { id: selectedComplaintId } : skipToken,
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [addComplaint, { isLoading: isAddComplaintLoading }] =
    useAddComplaintMutation();

  // ── Form ───────────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<complaintFormProps>({
    defaultValues: {
      reservationId: "",
      comment: "",
    },
  });

  // ── Search ─────────────────────────────────────────────────────────────────
  const { SearchBox } = useSearchBox({
    placeholder: t("SEARCH_COMPLAINTS"),
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAddModal = () => {
    reset({ reservationId: "", comment: "" });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    reset();
  };

  const openViewModal = (id: string) => {
    setSelectedComplaintId(id);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedComplaintId(null);
  };

  const handleAddComplaint = async (data: complaintFormProps) => {
    try {
      await addComplaint(data).unwrap();
      toast.success(t("COMPLAINT_ADDED_SUCCESS"));
      closeAddModal();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: TableProps<complaintResponseProps>["columns"] = [
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
      title: t("COMMENT"),
      dataIndex: "comment",
      key: "comment",
      render: (text) => (
        <p className="max-w-[300px] truncate">{text || t("NA")}</p>
      ),
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

  const data: complaintResponseProps[] = complaints?.data || [];

  // ── Title component ────────────────────────────────────────────────────────
  const handleTitleComponent = () => {
    return (
      <div className="flex gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
        <Button onClick={openAddModal} className="text-white bg-mainColor ">
          {t("ADD_COMPLAINT")}
        </Button>
      </div>
    );
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <main>
      <header>
        <Title title={t("COMPLAINTS")} component={handleTitleComponent()} />
      </header>

      <div>
        <section className="my-8 max-w-[80%] lg:max-w-[40%]">
          {SearchBox()}
        </section>

        <section className="mt-8">
          <Table<complaintResponseProps>
            rowKey="id"
            columns={columns}
            dataSource={data}
            loading={isLoading || isFetching}
          />
        </section>
      </div>

      {/* ── Add Complaint Modal ──────────────────────────────────────────── */}
      <Modal
        title={t("ADD_COMPLAINT")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isAddModalOpen}
        onCancel={closeAddModal}
        footer={null}
      >
        <form
          onSubmit={handleSubmit(handleAddComplaint)}
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
              loading={isAddComplaintLoading}
            >
              {t("SUBMIT")}
            </Button>
          </section>
        </form>
      </Modal>

      {/* ── View Complaint Modal ─────────────────────────────────────────── */}
      <Modal
        title={t("VIEW_COMPLAINT")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isViewModalOpen}
        onCancel={closeViewModal}
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
    </main>
  );
};

export default Complaints;
