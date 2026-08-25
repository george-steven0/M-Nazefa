import {
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import type { reservationFormProps } from "../../../components/Utilities/Types/types";
import { Button, Skeleton, Tag } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link } from "react-router-dom";
import {
  useGetAllPackagesExtraServiceQuery,
  useGetPackageByIdQuery,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { useEffect } from "react";
import { useAppSelector } from "../../../components/APIs/store";
import { useTranslation } from "react-i18next";
import { FaMinus, FaPlus } from "react-icons/fa";

type extraPackageProps = {
  index: number;
  control: Control<reservationFormProps>;
  errors: FieldErrors<reservationFormProps>;
  watch: UseFormWatch<reservationFormProps>;
  setValue: UseFormSetValue<reservationFormProps>;
  loading?: boolean;
};

export default function ExtraPackage({
  index,
  control,
  //   errors,
  setValue,
  loading,
  //   watch,
}: extraPackageProps) {

  const { lang } = useAppSelector((state) => state?.lang);
  const { t } = useTranslation();

  const packageId = useWatch({
    control,
    name: `addReservationPackagesDtos.${index}.packageId` as const,
  });
  // extra services
  const {
    data: extraServices,
    isLoading: extraServicesLoading,
    isFetching: extraServicesIsFetching,
  } = useGetAllPackagesExtraServiceQuery(
    packageId ? { id: packageId?.toString() } : skipToken,
  );

  const { data: packageById } = useGetPackageByIdQuery(
    packageId ? { id: packageId?.toString() } : skipToken,
  );

  useEffect(() => {
    if (packageById?.data?.price) {
      setValue(
        `addReservationPackagesDtos.${index}.packageAmount`,
        packageById?.data?.price ? Number(packageById?.data?.price) : 0,
      );
    }
  }, [index, packageById?.data?.price, setValue]);

  //   console.log(packageById?.data?.price);

  // console.log(extraServices?.data);

  // Each selected extra service is pushed as its own entry, so selecting the
  // same extra service more than once means pushing several entries with the
  // same packageExtraServiceId — quantity is simply how many entries match.
  const {
    fields: extraServiceFields,
    append: appendExtraService,
    remove: removeExtraService,
  } = useFieldArray({
    control,
    name: `addReservationPackagesDtos.${index}.reservationPackageExtraServices` as const,
  });

  const selectedExtraServices = useWatch({
    control,
    name: `addReservationPackagesDtos.${index}.reservationPackageExtraServices` as const,
  });

  const getQuantity = (extraServiceId: string | number) =>
    (selectedExtraServices ?? []).filter(
      (item) => String(item?.packageExtraServiceId) === String(extraServiceId),
    ).length;

  const handleIncrement = (extraServiceId: string | number) => {
    appendExtraService({ packageExtraServiceId: extraServiceId });
  };

  const handleDecrement = (extraServiceId: string | number) => {
    const lastIndex = extraServiceFields
      .map(
        (_, fieldIndex) =>
          String(selectedExtraServices?.[fieldIndex]?.packageExtraServiceId) ===
          String(extraServiceId),
      )
      .lastIndexOf(true);

    if (lastIndex > -1) {
      removeExtraService(lastIndex);
    }
  };

  if (loading) return <Skeleton active paragraph={{ rows: 3 }} />;

  return (
    <div className="flex flex-col gap-3">
      {packageId && (
        <div>
          <Link
            to={`/packages/view-package?id=${packageId}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View Package
          </Link>
        </div>
      )}

      {!packageId ? (
        <div className="flex items-center justify-center h-full">
          <Tag color="gold">{t("PLEASE_SELECT_PACKAGE")}</Tag>
        </div>
      ) : extraServicesLoading || extraServicesIsFetching ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        extraServices?.data?.map((item) => {
          const quantity = getQuantity(item.id);

          return (
            <div key={item.id} className="flex items-center gap-3">
              <span className="capitalize">
                <Tag
                  color="blue"
                  className="rounded-lg px-2 flex items-center gap-2 "
                >
                  <span>{lang === "ar" ? item?.arName : item?.name}</span>
                  <span>{item?.price} L.E</span>
                  {Number(item?.numberOfWorkers) > 0 && (
                    <span>
                      {item?.numberOfWorkers} {t("WORKERS")}
                    </span>
                  )}
                </Tag>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDecrement(item.id)}
                  className="bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                  icon={<FaMinus size={12} />}
                  shape="circle"
                  size="small"
                  disabled={quantity === 0}
                />
                <span className="min-w-4 text-center font-medium">
                  {quantity}
                </span>
                <Button
                  onClick={() => handleIncrement(item.id)}
                  className="bg-green-600 text-white"
                  icon={<FaPlus size={12} />}
                  shape="circle"
                  size="small"
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
