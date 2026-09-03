import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { type Dayjs } from "dayjs";
import { Button, DatePicker, Progress, Select, Skeleton, Table, Tag, type TableProps } from "antd";
import { toast } from "react-toastify";
import { FaCheckCircle, FaDownload, FaPoundSign } from "react-icons/fa";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { HiOutlineDocumentText, HiOutlineUserGroup } from "react-icons/hi2";
import { LuCalendarDays, LuPackageOpen } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { useAppSelector } from "../../components/APIs/store";
import {
  useGetDailyReservationReportQuery,
  useLazyGetDailyReservationReportPdfQuery,
} from "../../components/APIs/Reservations/RESERVATION_QUERY";
import { useGetAllAreasQuery } from "../../components/APIs/Areas/AREAS_RTK_QUERY";
import type { dailyReportItemProps } from "../../components/Utilities/Types/types";

// The report filter is a day, not an instant — send a bare date, no time.
const toWireDate = (date: Dayjs) => date.format("YYYY-MM-DD");

const renderValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
};

const pickString = (item: dailyReportItemProps, ...keys: string[]) => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value) return value;
  }
  return undefined;
};

const pickNumber = (item: dailyReportItemProps, ...keys: string[]) => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "number") return value;
  }
  return undefined;
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  Contract: <HiOutlineDocumentText size={18} />,
  Confirmed: <FaCheckCircle size={16} />,
  OnSpot: <AiOutlineThunderbolt size={18} />,
};

type StatTileProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  className: string;
};

const StatTile = ({ label, value, icon, className }: StatTileProps) => (
  <div
    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 sm:p-4 text-center ${className}`}
  >
    <span>{icon}</span>
    <span className="text-xl sm:text-2xl font-bold leading-none">{value}</span>
    <span className="text-[11px] sm:text-xs font-medium capitalize opacity-80">
      {label}
    </span>
  </div>
);

type MoneyTileProps = {
  label: string;
  value: number;
  className: string;
};

const MoneyTile = ({ label, value, className }: MoneyTileProps) => (
  <div className={`rounded-xl border p-4 ${className}`}>
    <span className="block text-xs font-medium capitalize opacity-70 mb-1">
      {label}
    </span>
    <span className="flex items-center gap-1 text-xl sm:text-2xl font-bold">
      <FaPoundSign size={16} />
      {value.toLocaleString()}
    </span>
  </div>
);

const Reports = () => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state?.lang);

  const [dateFilter, setDateFilter] = useState<Dayjs>(dayjs());
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [areaFilter, setAreaFilter] = useState<string | undefined>(undefined);

  const { SearchBox, debounceValue } = useSearchBox({
    placeholder: t("SEARCH"),
  });

  const { data: areas, isLoading: areasLoading } = useGetAllAreasQuery();

  const filterParams = {
    dateFilter: toWireDate(dateFilter),
    searchKey: debounceValue ? encodeURIComponent(debounceValue) : undefined,
    status: statusFilter,
    area: areaFilter,
  };

  const {
    data: reportRes,
    isLoading,
    isFetching,
  } = useGetDailyReservationReportQuery(filterParams);

  const report = reportRes?.data;

  const [triggerPdf, { isFetching: isPdfLoading }] =
    useLazyGetDailyReservationReportPdfQuery();

  const handleDownloadPdf = async () => {
    try {
      const blob = await triggerPdf(filterParams).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `daily-reservation-report-${dateFilter.format("YYYY-MM-DD")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t("REPORT_PDF_FAILED"));
    }
  };

  const totalAmount = report?.totalAmount ?? 0;
  const totalPaid = report?.totalPaid ?? 0;
  const totalRemaining = report?.totalRemaining ?? 0;
  const collectedPercent =
    totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  const emptyState = (
    <p className="flex items-center gap-2 justify-center w-full text-gray-300 capitalize py-6">
      <BsBoxSeam size={20} />
      <span>{t("NO_DATA_FOUND")}</span>
    </p>
  );

  const columns: TableProps<dailyReportItemProps>["columns"] = [
    {
      title: t("CUSTOMER_NAME"),
      key: "customerName",
      render: (row: dailyReportItemProps) => (
        <p>{renderValue(pickString(row, "customerName", "name"))}</p>
      ),
    },
    {
      title: t("PHONE_NUMBER"),
      key: "phone",
      render: (row: dailyReportItemProps) => (
        <p>{renderValue(pickString(row, "customerPhoneNumber", "phoneNumber"))}</p>
      ),
    },
    {
      title: t("TIME"),
      key: "time",
      render: (row: dailyReportItemProps) => {
        const raw = pickString(row, "reservationDate", "time");
        const parsed = raw ? dayjs(raw) : null;
        return <p>{parsed?.isValid() ? parsed.format("hh:mm A") : renderValue(raw)}</p>;
      },
    },
    {
      title: t("AREA"),
      key: "area",
      render: (row: dailyReportItemProps) => (
        <p>{renderValue(pickString(row, "areaName", "cityName"))}</p>
      ),
    },
    {
      title: t("PACKAGE_DETAILS"),
      key: "package",
      render: (row: dailyReportItemProps) => (
        <p>{renderValue(pickString(row, "packageName"))}</p>
      ),
    },
    {
      title: t("NO_WORKERS"),
      key: "workers",
      render: (row: dailyReportItemProps) => (
        <p>{renderValue(pickNumber(row, "numberOfWorkers"))}</p>
      ),
    },
    {
      title: t("STATUS"),
      key: "status",
      render: (row: dailyReportItemProps) => {
        const status =
          pickString(row, "status") ??
          (row.isConfirmed ? "Confirmed" : row.onSpot ? "OnSpot" : undefined);
        if (!status) return <span>{renderValue(undefined)}</span>;
        const isPositive = status === "Confirmed";
        return (
          <Tag
            className={`capitalize rounded-full ${isPositive ? "bg-green-50 text-green-600 border-green-500/60" : "bg-amber-50 text-amber-700 border-amber-500/60"}`}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: t("TOTAL_AMOUNT"),
      key: "amount",
      render: (row: dailyReportItemProps) => {
        const amount = pickNumber(row, "totalAmount", "amount");
        return (
          <p className="flex items-center gap-1">
            {amount !== undefined ? (
              <>
                <FaPoundSign size={12} />
                {amount.toLocaleString()}
              </>
            ) : (
              renderValue(undefined)
            )}
          </p>
        );
      },
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-lightGray min-h-screen rounded-lg">
      {/* ── Header: identity, filters, primary action ───────────────────── */}
      <header className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-mainColor capitalize">
              {t("DAILY_RESERVATION_REPORT")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("DAILY_RESERVATION_REPORT_DESC")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {report && (
              <div className="flex items-center gap-2 rounded-xl bg-mainColor/5 border border-mainColor/10 px-4 py-2">
                <LuCalendarDays className="text-mainColor shrink-0" size={20} />
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-mainColor capitalize">
                    {report.dayName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {dayjs(report.reportDate).format("DD-MM-YYYY")}
                  </span>
                </div>
              </div>
            )}

            <Button
              type="primary"
              icon={<FaDownload />}
              loading={isPdfLoading}
              onClick={handleDownloadPdf}
              className="bg-mainColor hover:bg-mainColor/90! border-none font-semibold capitalize"
            >
              {isPdfLoading ? t("GENERATING") : t("DOWNLOAD_PDF")}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 capitalize">
              {t("FILTER_BY_DATE")}
            </label>
            <DatePicker
              value={dateFilter}
              onChange={(date) => date && setDateFilter(date)}
              format="DD-MM-YYYY"
              allowClear={false}
              className="min-h-10 w-full sm:w-[210px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 capitalize">
              {t("FILTER_BY_STATUS")}
            </label>
            <Select
              allowClear
              placeholder={t("ALL_STATUSES")}
              className="min-h-10 w-full sm:w-[180px] [&_.ant-select-selector]:min-h-10"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { value: "Confirmed", label: t("CONFIRMED") },
                { value: "Pending", label: t("PENDING") },
                { value: "OnSpot", label: t("ON_SPOT") },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 capitalize">
              {t("FILTER_BY_AREA")}
            </label>
            <Select
              allowClear
              showSearch
              loading={areasLoading}
              placeholder={t("ALL_AREAS")}
              className="min-h-10 w-full sm:w-[180px] [&_.ant-select-selector]:min-h-10"
              value={areaFilter}
              onChange={(value) => setAreaFilter(value)}
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={areas?.data?.map((area) => ({
                value: area.id,
                label: lang === "ar" ? area.arName : area.name,
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
          {/* ── KPI row ─────────────────────────────────────────────────── */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
            <StatTile
              label={t("TOTAL_RESERVATIONS")}
              value={report?.totalReservations ?? 0}
              icon={<LuPackageOpen size={20} />}
              className="bg-mainColor/10 text-mainColor"
            />
            <StatTile
              label={t("CONTRACTS")}
              value={report?.contractCount ?? 0}
              icon={<HiOutlineDocumentText size={20} />}
              className="bg-purple-500/10 text-purple-700"
            />
            <StatTile
              label={t("CONFIRMED")}
              value={report?.confirmedCount ?? 0}
              icon={<FaCheckCircle size={18} />}
              className="bg-green-500/10 text-green-700"
            />
            <StatTile
              label={t("ON_SPOT")}
              value={report?.onSpotCount ?? 0}
              icon={<AiOutlineThunderbolt size={20} />}
              className="bg-amber-500/10 text-amber-700"
            />
            <StatTile
              label={t("CANCELLED")}
              value={report?.cancelledCount ?? 0}
              icon={<BsBoxSeam size={18} />}
              className="bg-red-500/10 text-red-600"
            />
            <StatTile
              label={t("TOTAL_WORKERS")}
              value={report?.totalWorkers ?? 0}
              icon={<HiOutlineUserGroup size={20} />}
              className="bg-blue-500/10 text-blue-700"
            />
          </section>

          {/* ── Money summary ───────────────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MoneyTile
                label={t("TOTAL_AMOUNT")}
                value={totalAmount}
                className="bg-mainColor/10 text-mainColor"
              />
              <MoneyTile
                label={t("TOTAL_PAID")}
                value={totalPaid}
                className="bg-green-500/10 text-green-700"
              />
              <MoneyTile
                label={t("TOTAL_REMAINING")}
                value={totalRemaining}
                className="bg-amber-500/25 text-amber-700"
              />
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5 capitalize">
                <span>{t("COLLECTED")}</span>
                <span className="font-semibold">{collectedPercent}%</span>
              </div>
              <Progress
                percent={collectedPercent}
                showInfo={false}
                strokeColor="#072d3c"
                trailColor="#f5f4f4"
              />
            </div>
          </section>

          {/* ── Sections (Contract / Confirmed / OnSpot) ───────────────── */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {report?.sections?.map((section) => (
              <div
                key={section.key}
                className="bg-white rounded-2xl shadow-sm p-4 sm:p-5"
              >
                <div className="flex items-center gap-2 mb-4 text-mainColor">
                  {SECTION_ICONS[section.key] ?? <BsBoxSeam size={18} />}
                  <h2 className="font-semibold capitalize">{section.title}</h2>
                  <span className="ms-auto inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-mainColor/10 text-xs font-semibold">
                    {section.items?.length ?? 0}
                  </span>
                </div>

                {section.items?.length ? (
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                    {section.items.map((item, index) => (
                      <div
                        key={item.id ?? item.reservationId ?? index}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                          <span className="font-medium text-[#1D1B1B] wrap-break-word">
                            {renderValue(
                              pickString(item, "customerName", "name"),
                            )}
                          </span>
                          {pickNumber(item, "totalAmount", "amount") !==
                            undefined && (
                            <span className="flex items-center gap-1 text-sm text-gray-600 shrink-0">
                              <FaPoundSign size={11} />
                              {pickNumber(
                                item,
                                "totalAmount",
                                "amount",
                              )?.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {(pickString(item, "areaName", "cityName") ||
                          pickNumber(item, "numberOfWorkers") !==
                            undefined) && (
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            {pickString(item, "areaName", "cityName") && (
                              <span>
                                {pickString(item, "areaName", "cityName")}
                              </span>
                            )}
                            {pickNumber(item, "numberOfWorkers") !==
                              undefined && (
                              <span className="flex items-center gap-1">
                                <HiOutlineUserGroup size={12} />
                                {pickNumber(item, "numberOfWorkers")}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  emptyState
                )}
              </div>
            ))}
          </section>

          {/* ── Full reservations list ─────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-[#1D1B1B] capitalize mb-4">
              {t("ALL_RESERVATIONS")}
            </h2>
            <Table<dailyReportItemProps>
              rowKey={(row, index) =>
                row.id ?? row.reservationId ?? index ?? 0
              }
              columns={columns}
              dataSource={report?.reservations ?? []}
              scroll={{ x: "max-content" }}
              className="w-full"
              pagination={{ pageSize: 10 }}
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

export default Reports;
