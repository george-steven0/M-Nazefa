import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import type { reservationFormProps } from "../../../components/Utilities/Types/types";
import { Checkbox, Skeleton, Tag } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import { Link } from "react-router-dom";
import {
  useGetAllPackagesExtraServiceQuery,
  useGetPackageByIdQuery,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { useEffect } from "react";
import { useAppSelector } from "../../../components/APIs/store";

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
          <Tag color="gold">Please select a package</Tag>
        </div>
      ) : extraServicesLoading || extraServicesIsFetching ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        extraServices?.data?.map((item, extraServiceIndex) => (
          <div key={item.id}>
            <Controller
              name={`addReservationPackagesDtos.${index}.reservationPackageExtraServices.${extraServiceIndex}.packageExtraServiceId`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value === item.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      field.onChange(item.id);
                    } else {
                      field.onChange(null);
                    }
                  }}
                >
                  <span className="capitalize">
                    <Tag
                      color="blue"
                      className="rounded-lg px-2 flex items-center gap-2 "
                    >
                      <span>{lang === "ar" ? item?.arName : item?.name}</span>
                      <span>{item?.price} L.E</span>
                    </Tag>
                  </span>
                </Checkbox>
              )}
            />
          </div>
        ))
      )}
    </div>
  );
}
