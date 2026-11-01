import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import { Button, DatePicker, Progress, Select, Skeleton, Table, Tag, type TableProps } from "antd";
import { FaPoundSign } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { useGetReservationDailyCollectionsReportQuery } from "../../components/APIs/Reservations/RESERVATION_QUERY";
import type {
  collectionStatus,
  dailyCollectionItemProps,
  dailyCollectionPaymentProps,
} from "../../components/Utilities/Types/types";

// The report filter is a day, not an instant — send a bare date, no time.
const toWireDate = (date: Dayjs) => date.format("YYYY-MM-DD");

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

const STATUSES: collectionStatus[] = ["Paid", "Partial", "Unpaid", "Free"];

const STATUS_STYLES: Record<collectionStatus, { label: string; className: string }> = {
  Paid: { label: "COLLECTION_PAID", className: "bg-green-50 text-green-700 border-green-500/60" },
  Partial: { label: "COLLECTION_PARTIAL", className: "bg-amber-50 text-amber-700 border-amber-500/60" },
  Unpaid: { label: "COLLECTION_UNPAID", className: "bg-red-50 text-red-600 border-red-500/60" },
  Free: { label: "COLLECTION_FREE", className: "bg-blue-50 text-blue-600 border-blue-500/60" },
};

const Money = ({ value, className = "" }: { value: number; className?: string }) => (
  <span dir="ltr" className={`inline-flex items-center gap-1 ${className}`}>
    <FaPoundSign size={11} />
    {formatMoney(value)}
  </span>
);

type MoneyTileProps = { label: string; value: number; className: string };

const MoneyTile = ({ label, value, className }: MoneyTileProps) => (
  <div className={`rounded-xl border p-4 ${className}`}>
    <span className="block text-xs font-medium capitalize opacity-70 mb-1">{label}</span>
    <span dir="ltr" className="flex items-center gap-1 text-xl sm:text-2xl font-bold">
      <FaPoundSign size={16} />
      {formatMoney(value)}
    </span>
  </div>
);

// تقرير التحصيلات اليومي: reservations of one day (by reservation date) with total / paid / remaining;
// each row expands to show its payments
const CollectionsReport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [dateFilter, setDateFilter] = useState<Dayjs>(dayjs());
  const [statusFilter, setStatusFilter] = useState<collectionStatus | undefined>(undefined);

  const { SearchBox, debounceValue } = useSearchBox({ placeholder: t("SEARCH") });

  const { data: reportRes, isLoading, isFetching } = useGetReservationDailyCollectionsReportQuery({
    dateFilter: toWireDate(dateFilter),
    status: statusFilter,
    searchKey: debounceValue ? encodeURIComponent(debounceValue.trim()) : undefined,
  });

  const report = reportRes?.data;
  const totalAmount = report?.totalAmount ?? 0;
  const totalPaid = report?.totalPaid ?? 0;
  const totalRemaining = report?.totalRemaining ?? 0;
  const collectedPercent = totalAmount > 0 ? Math.min(100, Math.round((totalPaid / totalAmount) * 100)) : 0;

  const columns: TableProps<dailyCollectionItemProps>["columns"] = [
    {
      title: t("RESERVATION_ID"),
      dataIndex: "reservationId",
      key: "reservationId",
      render: (id: number) => (
        <Button
          type="link"
          className="p-0"
          onClick={() => navigate(`/reservations/reservation-details?id=${id}`)}
        >
          #{id}
        </Button>
      ),
    },
    {
      title: t("TIME"),
      dataIndex: "reservationDate",
      key: "time",
      render: (value: string) => <span>{dayjs(value).format("hh:mm A")}</span>,
    },
    {
      title: t("CUSTOMER_NAME"),
      dataIndex: "customerName",
      key: "customerName",
      render: (value?: string | null) => <span className="font-medium">{value || t("NA")}</span>,
    },
    {
      title: t("PHONE_NUMBER"),
      dataIndex: "customerPhone",
      key: "customerPhone",
      render: (value?: string | null) => <span dir="ltr">{value || t("NA")}</span>,
    },
    {
      title: t("COLLECTION_TOTAL"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value: number) => <Money value={value} className="font-semibold" />,
    },
    {
      title: t("COLLECTION_PAID_AMOUNT"),
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (value: number) => <Money value={value} className="text-green-700" />,
    },
    {
      title: t("COLLECTION_REMAINING"),
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (value: number) => (
        <Money value={value} className={value > 0 ? "text-red-600 font-semibold" : "text-gray-500"} />
      ),
    },
    {
      title: t("COLLECTION_STATUS"),
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (value: collectionStatus) => (
        <Tag className={`capitalize rounded-full ${STATUS_STYLES[value]?.className ?? ""}`}>
          {t(STATUS_STYLES[value]?.label ?? value)}
        </Tag>
      ),
    },
    {
      title: t("PAYMENTS"),
      key: "paymentsCount",
      render: (row: dailyCollectionItemProps) => <span>{row.payments?.length ?? 0}</span>,
    },
  ];

  const paymentColumns: TableProps<dailyCollectionPaymentProps>["columns"] = [
    {
      title: t("COLLECTION_PAYMENT_DATE"),
      dataIndex: "operationDate",
      key: "operationDate",
      render: (value: string) => <span>{dayjs(value).format("DD-MM-YYYY")}</span>,
    },
    {
      title: t("TYPE"),
      dataIndex: "type",
      key: "type",
      render: (value: string) => (
        <Tag color={value === "Refund" ? "red" : "green"}>
          {t(value === "Refund" ? "REFUND" : "COLLECTION_PAYMENT")}
        </Tag>
      ),
    },
    {
      title: t("AMOUNT"),
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => (
        <Money value={value} className={value < 0 ? "text-red-600" : "text-green-700"} />
      ),
    },
    {
      title: t("PAYMENT_METHOD"),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (value?: string | null) => <span>{value || t("NA")}</span>,
    },
    {
      title: t("NOTES"),
      dataIndex: "note",
      key: "note",
      render: (value?: string | null) => (
        <span className="block max-w-[320px] whitespace-pre-wrap">{value || t("NA")}</span>
      ),
    },
    {
      title: t("CREATED_BY"),
      dataIndex: "createdByName",
      key: "createdByName",
      render: (value?: string | null) => <span>{value || t("NA")}</span>,
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-lightGray min-h-screen rounded-lg">
      {/* ── Header: identity and filters ──────────────────────────────────── */}
      <header className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-mainColor capitalize">
              {t("DAILY_COLLECTIONS_REPORT")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{t("DAILY_COLLECTIONS_REPORT_DESC")}</p>
          </div>

          {report && (
            <div className="flex items-center gap-2 rounded-xl bg-mainColor/5 border border-mainColor/10 px-4 py-2 self-start lg:self-auto">
              <LuCalendarDays className="text-mainColor shrink-0" size={20} />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-mainColor capitalize">{report.dayName}</span>
                <span className="text-xs text-gray-500">{dayjs(report.reportDate).format("DD-MM-YYYY")}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 capitalize">{t("FILTER_BY_DATE")}</label>
            <DatePicker
              value={dateFilter}
              onChange={(date) => date && setDateFilter(date)}
              format="DD-MM-YYYY"
              allowClear={false}
              className="min-h-10 w-full sm:w-[210px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 capitalize">{t("FILTER_BY_STATUS")}</label>
            <Select
              allowClear
              placeholder={t("ALL_STATUSES")}
              className="min-h-10 w-full sm:w-[200px] [&_.ant-select-selector]:min-h-10"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={STATUSES.map((status) => ({
                value: status,
                label: `${t(STATUS_STYLES[status].label)} (${report?.statusCounts?.[status] ?? 0})`,
              }))}
            />
          </div>

          <div className="grow min-w-[200px]">{SearchBox()}</div>
        </div>
      </header>

      {isLoading || isFetching ? (
        <Skeleton active paragraph={{ rows: 12 }} />
      ) : (
        <>
          {/* ── Money summary ───────────────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border p-4 bg-mainColor/10 text-mainColor">
                <span className="block text-xs font-medium capitalize opacity-70 mb-1">
                  {t("TOTAL_RESERVATIONS")}
                </span>
                <span className="text-xl sm:text-2xl font-bold">{report?.reservationsCount ?? 0}</span>
              </div>
              <MoneyTile label={t("TOTAL_AMOUNT")} value={totalAmount} className="bg-mainColor/10 text-mainColor" />
              <MoneyTile label={t("TOTAL_PAID")} value={totalPaid} className="bg-green-500/10 text-green-700" />
              <MoneyTile label={t("TOTAL_REMAINING")} value={totalRemaining} className="bg-red-500/10 text-red-600" />
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5 capitalize">
                <span>{t("COLLECTED")}</span>
                <span className="font-semibold">{collectedPercent}%</span>
              </div>
              <Progress percent={collectedPercent} showInfo={false} strokeColor="#072d3c" trailColor="#f5f4f4" />
            </div>
          </section>

          {/* ── Reservations; each row expands to its payments ──────────── */}
          <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 overflow-x-auto">
            <Table<dailyCollectionItemProps>
              rowKey="reservationId"
              columns={columns}
              dataSource={report?.reservations ?? []}
              scroll={{ x: "max-content" }}
              pagination={{ pageSize: 20 }}
              expandable={{
                rowExpandable: (row) => (row.payments?.length ?? 0) > 0,
                expandedRowRender: (row) => (
                  <Table<dailyCollectionPaymentProps>
                    rowKey="id"
                    size="small"
                    columns={paymentColumns}
                    dataSource={row.payments}
                    pagination={false}
                    className="my-2"
                  />
                ),
              }}
              locale={{
                emptyText: (
                  <p className="flex items-center gap-2 justify-center w-full text-gray-300 capitalize py-6">
                    <BsBoxSeam size={20} />
                    <span>{t("NO_RESERVATIONS_FOR_THIS_DAY")}</span>
                  </p>
                ),
              }}
            />
          </section>
        </>
      )}
    </main>
  );
};

export default CollectionsReport;
