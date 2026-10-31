import { Button, Popconfirm, Table, Tag, Tooltip, type TableProps } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { isAdmin, isSuperAdmin } from "../../../Utilities/utilities";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";

dayjs.extend(utc);
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetReservationByIdQuery } from "../../../components/APIs/Reservations/RESERVATION_QUERY";
import { useGetCustomerWalletQuery } from "../../../components/APIs/CustomerWallet/CUSTOMER_WALLET_QUERY";
import {
  useAddReservationPaymentMutation,
  useDeleteReservationPaymentMutation,
  useEditReservationPaymentMutation,
  useGetPaymentMethodsQuery,
  useGetReservationPaymentsQuery,
} from "../../../components/APIs/Reservations/RESERVATION_PAYMENTS_QUERY";
import type {
  APIErrorProps,
  reservationPaymentsProps,
} from "../../../components/Utilities/Types/types";
import Title from "../../../components/Common/Title/title";
import AddPaymentModal from "./addPaymentModal";

export default function PayemntsDetails() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("id") || "";

  const {
    data: payments,
    isLoading: paymentsLoading,
    isFetching: paymentsFetching,
  } = useGetReservationPaymentsQuery(reservationId);

  const { data: methods, isFetching: methodsFetching } =
    useGetPaymentMethodsQuery();

  const [addPayment, { isLoading: addPaymentLoading }] =
    useAddReservationPaymentMutation();

  // Customer of this reservation -> wallet balance for "Wallet" payments
  const { data: reservation } = useGetReservationByIdQuery(
    reservationId ? { id: reservationId } : skipToken,
  );
  const customerId = reservation?.data?.customerId;
  const { data: wallet } = useGetCustomerWalletQuery(
    customerId ? { customerId } : skipToken,
  );

  const [editPayment, { isLoading: editPaymentLoading }] =
    useEditReservationPaymentMutation();
  const [deletePayment] = useDeleteReservationPaymentMutation();

  // Only admins can edit / delete (the API enforces it too)
  const canManage = isAdmin() || isSuperAdmin();
  const isCancelled = reservation?.data?.isActive === false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"Pay" | "Refund">("Pay");
  const [editing, setEditing] = useState<reservationPaymentsProps | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<reservationPaymentsProps>({
    defaultValues: {
      reservationId: reservationId,
      type: "",
      amount: 0,
      operationDate: "",
      paymentMethod: "",
      note: "",
    },
  });

  const openModal = (mode: "Pay" | "Refund") => {
    setEditing(null);
    setPaymentMode(mode);
    setIsModalOpen(true);
  };
  const openEditModal = (row: reservationPaymentsProps) => {
    setEditing(row);
    setPaymentMode(row.type === "Refund" ? "Refund" : "Pay");
    reset({
      reservationId,
      type: row.type,
      amount: Math.abs(Number(row.amount)),
      operationDate: row.operationDate
        ? dayjs.utc(row.operationDate).toISOString()
        : "",
      paymentMethod: row.paymentMethod,
      note: row.note || "",
    });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    reset();
  };

  // What deleting does to the customer's wallet (only Wallet payments touch it)
  const deleteWalletMessage = (row: reservationPaymentsProps) => {
    if (row.paymentMethod !== "Wallet") return t("DELETE_PAYMENT_CONFIRM");
    const amount = Math.abs(Number(row.amount));
    return row.type === "Refund"
      ? t("PAYMENT_WALLET_TAKE", { amount })
      : t("PAYMENT_WALLET_RETURN", { amount });
  };

  const handleDelete = async (row: reservationPaymentsProps) => {
    if (!row.id) return;
    try {
      await deletePayment({ id: row.id }).unwrap();
      toast.success(t("PAYMENT_DELETED_SUCCESS"));
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((m) => toast.error(m));
    }
  };

  // Balance available to a Wallet payment being edited = wallet + what this payment already took from it
  const editWalletBalance =
    editing && editing.paymentMethod === "Wallet" && editing.type === "Pay"
      ? Number(wallet?.data?.balance ?? 0) + Math.abs(Number(editing.amount))
      : wallet?.data?.balance;

  const handleAddPayment = async (data: reservationPaymentsProps) => {
    // const enteredAmount = Math.abs(Number(data.amount));
    // const signedAmount =
    //   data.type === "Refund" ? -enteredAmount : enteredAmount;

    try {
      if (editing?.id) {
        await editPayment({
          id: editing.id,
          amount: Math.abs(Number(data.amount)),
          paymentMethod: data.paymentMethod,
          operationDate: dayjs(data.operationDate).toISOString(),
          note: data.note || null,
        }).unwrap();
        toast.success(t("PAYMENT_UPDATED_SUCCESS"));
        closeModal();
        return;
      }
      await addPayment({
        ...data,
        type: paymentMode,
        reservationId: Number(reservationId),
        // amount: signedAmount,
        operationDate: dayjs(data.operationDate).toISOString(),
      }).unwrap();
      toast.success(
        t(paymentMode === "Refund" ? "REFUND_ADDED_SUCCESS" : "PAYMENT_ADDED_SUCCESS"),
      );
      closeModal();
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages?.length) {
        err.data.errorMessages.forEach((m) => toast.error(m));
      } else {
        toast.error(t("DEACTIVATE_ERROR"));
      }
    }
  };

  const columns: TableProps<reservationPaymentsProps>["columns"] = [
    {
      title: t("PAYMENT_METHOD"),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("AMOUNT"),
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <p>
          {text} {t("EGP")}
        </p>
      ),
    },
    {
      title: t("OPERATION_DATE"),
      dataIndex: "operationDate",
      key: "operationDate",
      render: (text) =>
        text ? (
          <span>{dayjs.utc(text).local().format("DD-MM-YYYY hh:mm A")}</span>
        ) : (
          "-"
        ),
    },
    {
      title: t("TYPE"),
      dataIndex: "type",
      key: "type",
      render: (text, row) => (
        <div className="flex flex-wrap items-center gap-1">
          <span>{text}</span>
          {row.isSystem && <Tag color="blue">{t("SYSTEM_PAYMENT")}</Tag>}
          {row.modifiedAt && (
            <Tooltip
              title={`${t("EDITED_BY")} ${row.modifiedByName || t("NA")} (${dayjs(row.modifiedAt).format("DD-MM-YYYY hh:mm A")})`}
            >
              <Tag color="orange" className="cursor-help">
                {t("EDITED")}
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: t("NOTES"),
      dataIndex: "note",
      key: "note",
      render: (text) => <span>{text || "-"}</span>,
    },
    ...(canManage
      ? [
          {
            title: t("ACTIONS"),
            key: "actions",
            render: (_: unknown, row: reservationPaymentsProps) => {
              const locked = row.isSystem || isCancelled;
              const lockedReason = row.isSystem
                ? t("SYSTEM_PAYMENT_LOCKED")
                : t("CANCELLED_PAYMENTS_LOCKED");
              return (
                <div className="flex items-center gap-2">
                  <Tooltip title={locked ? lockedReason : undefined}>
                    <Button
                      shape="circle"
                      disabled={locked}
                      onClick={() => openEditModal(row)}
                      icon={<BiEdit size={18} />}
                    />
                  </Tooltip>
                  <Popconfirm
                    title={t("DELETE_PAYMENT")}
                    description={deleteWalletMessage(row)}
                    okText={t("DELETE")}
                    cancelText={t("CANCEL")}
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDelete(row)}
                    disabled={locked}
                  >
                    <Tooltip title={locked ? lockedReason : undefined}>
                      <Button
                        danger
                        shape="circle"
                        disabled={locked}
                        icon={<AiOutlineDelete size={18} />}
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const dataSource: reservationPaymentsProps[] = payments?.data || [];

  const TitleComponent = () => (
    <div className="flex gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
      {reservation?.data?.isActive !== false && (
        <Button onClick={() => openModal("Pay")} className="text-white bg-mainColor">
          {t("ADD_PAYMENT")}
        </Button>
      )}
      <Button
        onClick={() => openModal("Refund")}
        className="text-mainColor bg-white border-mainColor"
      >
        {t("ADD_REFUND")}
      </Button>
    </div>
  );

  return (
    <main>
      <header>
        <Title title={t("PAYMENTS")} component={<TitleComponent />} />
      </header>

      <section className="mt-8">
        <Table<reservationPaymentsProps>
          rowKey={(record, index) =>
            String(record.id ?? `${record.reservationId}-${record.operationDate}-${index}`)
          }
          columns={columns}
          dataSource={dataSource}
          loading={paymentsLoading || paymentsFetching}
        />
      </section>

      <AddPaymentModal
        open={isModalOpen}
        close={closeModal}
        t={t}
        control={control}
        handleSubmit={handleSubmit}
        submitFunction={handleAddPayment}
        errors={errors}
        loading={addPaymentLoading || editPaymentLoading}
        paymentMethods={methods?.data}
        methodsLoading={methodsFetching}
        mode={paymentMode}
        walletBalance={editWalletBalance}
        isEdit={!!editing}
      />
    </main>
  );
}
