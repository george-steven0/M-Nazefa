import { useCallback, useEffect, useState } from "react";
import { useWatch, type Control } from "react-hook-form";
import type { reservationFormProps } from "../../../components/Utilities/Types/types";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetAllPackagesExtraServiceQuery,
  useGetPackageByIdQuery,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { useAppSelector } from "../../../components/APIs/store";
import { Divider, Skeleton, Tag } from "antd";
import { useTranslation } from "react-i18next";

// ─── Per-Package Summary Row ─────────────────────────────────────────────────

type PackageSummaryRowProps = {
  index: number;
  control: Control<reservationFormProps>;
  onUpdateTotal: (index: number, total: number) => void;
};

function PackageSummaryRow({
  index,
  control,
  onUpdateTotal,
}: PackageSummaryRowProps) {
  const { lang } = useAppSelector((state) => state?.lang);
  const { t } = useTranslation();

  const packageId = useWatch({
    control,
    name: `addReservationPackagesDtos.${index}.packageId` as const,
  });

  const selectedExtraServices = useWatch({
    control,
    name: `addReservationPackagesDtos.${index}.reservationPackageExtraServices` as const,
  });

  const { data: packageById, isLoading: packageLoading } =
    useGetPackageByIdQuery(
      packageId ? { id: packageId.toString() } : skipToken,
    );

  const { data: extraServices, isLoading: extraServicesLoading } =
    useGetAllPackagesExtraServiceQuery(
      packageId ? { id: packageId.toString() } : skipToken,
    );

  const pkg = packageById?.data;

  // ── Discount calculation ──────────────────────────────────────────────────
  let basePrice = 0;
  let discount = 0;
  let isPercentage = false;
  let discountAmount = 0;
  let priceAfterDiscount = 0;

  if (pkg) {
    basePrice = Number(pkg.price) || 0;
    discount = Number(pkg.discount) || 0;
    const rawIsPercentage: unknown =
      pkg.isPercentage ?? (pkg as { IsPercentage?: unknown }).IsPercentage;
    isPercentage = rawIsPercentage === true || rawIsPercentage === "true";

    priceAfterDiscount = basePrice;
    if (discount > 0) {
      if (isPercentage) {
        discountAmount = (basePrice * discount) / 100;
      } else {
        discountAmount = discount;
      }
      priceAfterDiscount = Math.max(0, basePrice - discountAmount);
    }
  }

  // ── Selected extra services ────────────────────────────────────────────────
  const selectedIds = new Set(
    (selectedExtraServices ?? [])
      .map((s) => s?.packageExtraServiceId)
      .filter(Boolean),
  );

  const checkedExtras = (extraServices?.data ?? []).filter((es) =>
    selectedIds.has(es.id as string | number),
  );

  const extraServicesTotal = checkedExtras.reduce(
    (sum, es) => sum + (Number(es.price) || 0),
    0,
  );

  const rowTotal = pkg ? priceAfterDiscount + extraServicesTotal : 0;

  useEffect(() => {
    onUpdateTotal(index, rowTotal);
  }, [index, rowTotal, onUpdateTotal]);

  if (!packageId) return null;

  if (packageLoading || extraServicesLoading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  if (!pkg) return null;

  const packageName =
    lang === "ar"
      ? (pkg as { arTitle?: string }).arTitle || pkg.title
      : pkg.title;

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Package name + base price */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#1D1B1B] capitalize">
          {packageName}
        </span>
        <span className="text-gray-700 font-medium">
          {basePrice.toLocaleString()} {t("EGP")}
        </span>
      </div>

      {/* Discount row */}
      {discount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {t("DISCOUNT")}{" "}
            <Tag color="volcano" className="ms-1">
              {isPercentage ? `${discount}%` : `${discount} ${t("EGP")}`}
            </Tag>
          </span>
          <span className="text-red-500">
            - {discountAmount.toLocaleString()} {t("EGP")}
          </span>
        </div>
      )}

      {/* Price after discount */}
      {discount > 0 && (
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-gray-600">{t("PRICE_AFTER_DISCOUNT")}</span>
          <span className="text-green-700">
            {priceAfterDiscount.toLocaleString()} {t("EGP")}
          </span>
        </div>
      )}

      {/* Checked extra services */}
      {checkedExtras.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {t("EXTRA_SERVICE_DETAILS")}
          </span>
          {checkedExtras.map((es) => (
            <div
              key={es.id}
              className="flex items-center justify-between text-sm ps-2"
            >
              <span className="text-gray-600 capitalize">
                {lang === "ar" ? es.arName : es.name}
              </span>
              <span className="text-gray-700">
                + {Number(es.price).toLocaleString()} {t("EGP")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Row total */}
      <Divider className="my-1" />
      <div className="flex items-center justify-between font-semibold text-[#1D1B1B]">
        <span>{t("SUBTOTAL")}</span>
        <span>
          {rowTotal.toLocaleString()} {t("EGP")}
        </span>
      </div>
    </div>
  );
}

// ─── Main Summary Component ───────────────────────────────────────────────────

type ReservationSummaryProps = {
  control: Control<reservationFormProps>;
};

export default function ReservationSummary({
  control,
}: ReservationSummaryProps) {
  const { t } = useTranslation();
  const [subtotals, setSubtotals] = useState<Record<number, number>>({});

  const packages = useWatch({
    control,
    name: "addReservationPackagesDtos",
  });

  const handleUpdateSubtotal = useCallback((index: number, total: number) => {
    setSubtotals((prev) => {
      if (prev[index] === total) return prev;
      return { ...prev, [index]: total };
    });
  }, []);

  const hasAnyPackage = packages?.some((p) => p?.packageId);

  if (!hasAnyPackage) return null;

  const grandTotal =
    packages?.reduce((sum, pkg, index) => {
      if (!pkg?.packageId) return sum;
      return sum + (subtotals[index] || 0);
    }, 0) || 0;

  return (
    <div className="col-span-full mt-2">
      <div className="rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-mainColor px-5 py-3">
          <h3 className="text-white font-semibold text-lg capitalize">
            {t("RESERVATION_SUMMARY")}
          </h3>
        </div>

        {/* Package rows */}
        <div className="p-4 flex flex-col gap-3">
          {packages?.map((pkg, index) =>
            pkg?.packageId ? (
              <PackageSummaryRow
                key={index}
                index={index}
                control={control}
                onUpdateTotal={handleUpdateSubtotal}
              />
            ) : null,
          )}

          {/* Grand total */}
          <div className="flex items-center justify-between bg-mainColor/10 rounded-lg px-4 py-3 mt-1">
            <span className="font-bold text-mainColor text-lg capitalize">
              {t("TOTAL_AMOUNT")}
            </span>
            <span className="font-bold text-mainColor text-xl">
              {grandTotal.toLocaleString()} {t("EGP")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
