import { Button, Skeleton, Table, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { BiWallet } from "react-icons/bi";
import Title from "../../components/Common/Title/title";
import { useGetCustomerWalletQuery } from "../../components/APIs/CustomerWallet/CUSTOMER_WALLET_QUERY";
import type {
  walletTransactionProps,
  walletTransactionType,
} from "../../components/Utilities/Types/types";
import { isAdmin, isSuperAdmin } from "../../Utilities/utilities";
import WalletTransactionModal, {
  type walletModalMode,
} from "./Components/walletTransactionModal";

const TYPE_COLORS: Record<walletTransactionType, string> = {
  OpeningBalance: "blue",
  Deposit: "green",
  ReservationPayment: "orange",
  Refund: "cyan",
  CashBack: "purple",
  // Deduct is the only manual type that takes money out, so it stands out in red
  Deduct: "red",
  PaymentCorrection: "gold",
};

const TYPE_LABELS: Record<walletTransactionType, string> = {
  OpeningBalance: "WALLET_TYPE_OPENING_BALANCE",
  Deposit: "WALLET_TYPE_DEPOSIT",
  ReservationPayment: "WALLET_TYPE_RESERVATION_PAYMENT",
  Refund: "WALLET_TYPE_REFUND",
  CashBack: "WALLET_TYPE_CASHBACK",
  Deduct: "WALLET_TYPE_DEDUCT",
  PaymentCorrection: "WALLET_TYPE_PAYMENT_CORRECTION",
};

const formatAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

const CustomerWallet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("id");

  // Only admins manage wallets; everyone who can open the page can view it
  const canManage = isAdmin() || isSuperAdmin();

  const [modalMode, setModalMode] = useState<walletModalMode | null>(null);

  const {
    data: wallet,
    isLoading,
    isFetching,
  } = useGetCustomerWalletQuery(customerId ? { customerId } : skipToken);

  const walletData = wallet?.data;
  const transactions = walletData?.transactions || [];
  const canAddOpeningBalance = canManage && transactions.length === 0;

  const columns: TableProps<walletTransactionProps>["columns"] = [
    {
      title: t("TRANSACTION_DATE"),
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text) => (
        <span>{text ? dayjs(text).format("DD-MM-YYYY hh:mm A") : t("NA")}</span>
      ),
    },
    {
      title: t("TYPE"),
      dataIndex: "type",
      key: "type",
      render: (type: walletTransactionType) => (
        <Tag color={TYPE_COLORS[type] ?? "default"}>
          {t(TYPE_LABELS[type] ?? type)}
        </Tag>
      ),
    },
    {
      title: t("AMOUNT"),
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <p
          dir="ltr"
          className={`font-semibold ${amount >= 0 ? "text-green-600" : "text-red-500"}`}
        >
          {amount >= 0 ? "+" : ""}
          {formatAmount(amount)} {t("EGP")}
        </p>
      ),
    },
    {
      title: t("BALANCE_AFTER"),
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      render: (value: number) => (
        <p dir="ltr">
          {formatAmount(value)} {t("EGP")}
        </p>
      ),
    },
    {
      title: t("RESERVATION_ID"),
      dataIndex: "reservationId",
      key: "reservationId",
      render: (reservationId?: number | null) =>
        reservationId ? (
          <Button
            type="link"
            className="p-0"
            onClick={() =>
              navigate(`/reservations/reservation-details?id=${reservationId}`)
            }
          >
            #{reservationId}
          </Button>
        ) : (
          <span>{t("NA")}</span>
        ),
    },
    {
      title: t("DESCRIPTION"),
      dataIndex: "description",
      key: "description",
      render: (text) => <p className="max-w-[300px] truncate">{text || t("NA")}</p>,
    },
    {
      title: t("CREATED_BY"),
      dataIndex: "createdByName",
      key: "createdByName",
      render: (text) => <p>{text || t("NA")}</p>,
    },
  ];

  const TitleComponent = () =>
    canManage ? (
      <div className="flex gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
        {canAddOpeningBalance && (
          <Button
            onClick={() => setModalMode("opening")}
            className="text-white bg-mainOrange"
          >
            {t("ADD_OPENING_BALANCE")}
          </Button>
        )}
        <Button
          onClick={() => setModalMode("transaction")}
          className="text-white bg-mainColor"
        >
          {t("ADD_WALLET_TRANSACTION")}
        </Button>
      </div>
    ) : null;

  if (isLoading) {
    return (
      <main>
        <Skeleton active paragraph={{ rows: 8 }} />
      </main>
    );
  }

  return (
    <main>
      <header>
        <Title title={t("CUSTOMER_WALLET")} component={<TitleComponent />} />
      </header>

      {/* Balance card */}
      <section className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-white p-6 shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-full bg-mainColor/10 text-mainColor">
          <BiWallet size={28} />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">{walletData?.customerName}</span>
          <span className="text-sm font-semibold text-mainColor">
            {t("WALLET_BALANCE")}
          </span>
          <span
            dir="ltr"
            className="text-3xl font-bold text-mainColor"
          >
            {formatAmount(walletData?.balance ?? 0)} {t("EGP")}
          </span>
        </div>
      </section>

      <section className="mt-8">
        <Table<walletTransactionProps>
          rowKey="id"
          columns={columns}
          dataSource={transactions}
          loading={isFetching}
        />
      </section>

      {customerId && (
        <WalletTransactionModal
          open={modalMode !== null}
          mode={modalMode ?? "transaction"}
          customerId={customerId}
          onClose={() => setModalMode(null)}
        />
      )}
    </main>
  );
};

export default CustomerWallet;
