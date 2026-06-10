import { Button, Table, type TableProps } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";

dayjs.extend(utc);
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import {
  useAddReservationPaymentMutation,
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

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleAddPayment = async (data: reservationPaymentsProps) => {
    // const enteredAmount = Math.abs(Number(data.amount));
    // const signedAmount =
    //   data.type === "Refund" ? -enteredAmount : enteredAmount;

    try {
      await addPayment({
        ...data,
        reservationId: Number(reservationId),
        // amount: signedAmount,
        operationDate: dayjs(data.operationDate).toISOString(),
      }).unwrap();
      toast.success(t("PAYMENT_ADDED_SUCCESS"));
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
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("NOTES"),
      dataIndex: "note",
      key: "note",
      render: (text) => <span>{text || "-"}</span>,
    },
  ];

  const dataSource: reservationPaymentsProps[] = payments?.data || [];

  const TitleComponent = () => (
    <Button
      onClick={openModal}
      className="text-white bg-mainColor py-5 capitalize"
    >
      {t("ADD_PAYMENT")}
    </Button>
  );

  return (
    <main>
      <header>
        <Title title={t("PAYMENTS")} component={<TitleComponent />} />
      </header>

      <section className="mt-8">
        <Table<reservationPaymentsProps>
          rowKey={(record, index) =>
            `${record.reservationId}-${record.operationDate}-${index}`
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
        loading={addPaymentLoading}
        paymentMethods={methods?.data}
        methodsLoading={methodsFetching}
      />
    </main>
  );
}
