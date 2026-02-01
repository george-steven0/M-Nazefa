import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import type { clientFormPropsType } from "../../../../components/Utilities/Types/types";
import type { TFunction } from "i18next";
import { Button, Select, Input, Checkbox, Space } from "antd";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Required for the 'Z' (UTC) output
import {
  useGetAddressTypesQuery,
  useGetAreasQuery,
  useGetBuildingTypesQuery,
  useGetCitiesQuery,
  useGetLandTypesQuery,
} from "../../../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import { skipToken } from "@reduxjs/toolkit/query";
import Astrisk from "../../../../components/Common/Astrisk/astrisk";

dayjs.extend(utc);
// const { RangePicker } = DatePicker;
type AddressRowProps = {
  index: number;
  control: Control<clientFormPropsType>;
  errors: FieldErrors<clientFormPropsType>;
  lang: string | null | undefined;
  t: TFunction;
  length: number;
  handleRemoveAddress: (index: number) => void;
};
const AddressRow = ({
  index,
  control,
  errors,
  lang,
  handleRemoveAddress,
  t,
  length,
}: AddressRowProps) => {
  const {
    data: cities,
    isFetching: isCitiesFetching,
    isLoading: isCitiesLoading,
  } = useGetCitiesQuery();

  const cityId = useWatch({
    control,
    name: `customerAddresses.${index}.cityId`,
  });

  const addressTypeId = useWatch({
    control,
    name: `customerAddresses.${index}.addressTypeId`,
  });

  // console.log(addressTypeId);

  const {
    data: areas,
    isFetching: isAreasFetching,
    isLoading: isAreasLoading,
  } = useGetAreasQuery(cityId ? { cityId } : skipToken);

  const {
    data: buildingType,
    isFetching: isBuildingTypeFetching,
    isLoading: isBuildingTypeLoading,
  } = useGetBuildingTypesQuery({ id: addressTypeId });

  const {
    data: landType,
    isFetching: isLandTypeFetching,
    isLoading: isLandTypeLoading,
  } = useGetLandTypesQuery();

  const {
    data: addressTypes,
    isLoading: isAddressTypesLoading,
    isFetching: isAddressTypesFetching,
  } = useGetAddressTypesQuery();

  const {
    fields: favListFields,
    append: appendFavList,
    remove: removeFavList,
  } = useFieldArray({
    control,
    name: "favoriteList",
  });

  const {
    fields: notRecommendedListFields,
    append: appendNotRecommendedList,
    remove: removeNotRecommendedList,
  } = useFieldArray({
    control,
    name: "NotRecommendedWorkerList",
  });

  return (
    <>
      <section className="address-info-section">
        <article className="col-span-full basis-full flex items-center gap-5 personal-title capitalize text-xl text-[#1D1B1B] font-semibold">
          <p>
            {t("ADDRESS")} #{index + 1}
          </p>
          {length <= 1 ? null : (
            <Button
              icon={<FaTrashAlt />}
              onClick={() => handleRemoveAddress(index)}
              className="bg-red-600 text-white border-none"
              shape="circle"
            />
          )}
        </article>

        {/* CITY */}
        <div>
          <label>
            {t("CITY")}
            <Astrisk />
          </label>

          <Controller
            control={control}
            name={`customerAddresses.${index}.cityId`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Select city"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.cityId ? "error" : ""
                }
                loading={isCitiesLoading || isCitiesFetching}
                options={cities?.data?.map((city) => ({
                  value: city.id,
                  label: lang === "ar" ? city.arName : city.name,
                }))}
                showSearch
                optionFilterProp="label"
                // notFoundContent={
                //   <p className="text-red-500">{t("NOT_FOUND")}</p>
                // }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.cityId && (
            <p>{errors.customerAddresses[index].cityId.message}</p>
          )}
        </div>

        {/* AREA */}
        <div>
          <label>
            {t("AREA")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.AreaId`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Select area"
                variant="filled"
                disabled={!cityId}
                status={
                  errors?.customerAddresses?.[index]?.AreaId ? "error" : ""
                }
                loading={isAreasLoading || isAreasFetching}
                options={areas?.data?.map((area) => ({
                  value: area.id,
                  label: lang === "ar" ? area.arName : area.name,
                }))}
                showSearch
                optionFilterProp="label"
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.AreaId && (
            <p>{errors.customerAddresses[index].AreaId.message}</p>
          )}
        </div>

        {/* STREET */}
        <div>
          <label>
            {t("STREET")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.street`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter street"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.street ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.street && (
            <p>{errors.customerAddresses[index].street.message}</p>
          )}
        </div>

        {/* APARTMENT */}
        <div>
          <label>
            {t("APARTMENT")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.apartment`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter apartment number"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.apartment ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.apartment && (
            <p>{errors.customerAddresses[index].apartment.message}</p>
          )}
        </div>

        {/* FLOOR */}
        <div>
          <label>
            {t("FLOOR")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.floor`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
              pattern: {
                value: /^[0-9]+$/,
                message: t("ONLY_NUMBER"),
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter floor number"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.floor ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.floor && (
            <p>{errors.customerAddresses[index].floor.message}</p>
          )}
        </div>

        {/* POSTAL CODE */}
        {/* <div>
          <label>{t("POSTAL_CODE")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.postalCode`}
            rules={{
              // required: { value: true, message: t("REQUIRED") },
              pattern: {
                value: /^[0-9]+$/,
                message: t("ONLY_NUMBER"),
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter postal code"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.postalCode ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.postalCode && (
            <p>{errors.customerAddresses[index].postalCode.message}</p>
          )}
        </div> */}

        {/* LANDMARK */}
        <div>
          <label>
            {t("LANDMARK")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.landmark`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter landmark"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.landmark ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.landmark && (
            <p>{errors.customerAddresses[index].landmark.message}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="md:col-span-full ">
          <label>
            {t("DESCRIPTION")} <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.fullDescription`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter description"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.fullDescription
                    ? "error"
                    : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.fullDescription && (
            <p>{errors.customerAddresses[index].fullDescription.message}</p>
          )}
        </div>
      </section>

      {/* --------------------------------------- */}
      {/* BUILDING INFO (ALSO INSIDE addresses[index]) */}
      {/* --------------------------------------- */}

      <section className="bulding-info-wrapper">
        <div className="capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
          {t("BUILDING_DETAILS")}
        </div>

        {/* SPACE */}
        <div>
          <label>
            {t("SPACE")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.space`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter space"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.space ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.space && (
            <p>{errors.customerAddresses[index].space.message}</p>
          )}
        </div>

        {/* ADDRESS TYPE */}
        <div>
          <label>
            {t("ADDRESS_TYPE")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.addressTypeId`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md capitalize w-full"
                placeholder="Select address type"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.addressTypeId
                    ? "error"
                    : ""
                }
                loading={isAddressTypesLoading || isAddressTypesFetching}
                options={addressTypes?.data?.map((area) => ({
                  value: area.id,
                  label: lang === "ar" ? area.arName : area.name,
                }))}

                // onChange={(_e, option) => {
                //   if (option && !Array.isArray(option)) {
                //     setBuildType({
                //       value: option.value as string,
                //       label: option.label,
                //     });
                //   }
                // }}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.addressTypeId && (
            <p>{errors.customerAddresses[index].addressTypeId.message}</p>
          )}
        </div>

        {/* BUILDING TYPE */}
        <div>
          <label>
            {t("BUILDING_TYPE")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.BuildingTypeId`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md capitalize w-full"
                placeholder="Select building type"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.BuildingTypeId
                    ? "error"
                    : ""
                }
                disabled={!addressTypeId}
                loading={isBuildingTypeLoading || isBuildingTypeFetching}
                options={buildingType?.data?.map((area) => ({
                  value: area.id,
                  label: lang === "ar" ? area.arName : area.name,
                }))}
                // onChange={(_e, option) => {
                //   if (option && !Array.isArray(option)) {
                //     setBuildType({
                //       value: option.value as string,
                //       label: option.label,
                //     });
                //   }
                // }}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.BuildingTypeId && (
            <p>{errors.customerAddresses[index].BuildingTypeId.message}</p>
          )}
        </div>

        {/* Villa Floors */}
        <div>
          <label>
            {t("NUMBER_OF_FLOORS")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.noOfFloors`}
            defaultValue={0}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Number of floors"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.noOfFloors ? "error" : ""
                }
                defaultValue={0}
                options={Array.from({ length: 15 })?.map((_, index) => ({
                  label: index,
                  value: index,
                }))}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.noOfFloors && (
            <p>{errors.customerAddresses[index].noOfFloors.message}</p>
          )}
        </div>

        {/* LAND TYPE */}
        <div>
          <label>
            {t("LAND_TYPE")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.LandTypeId`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Select land type"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.LandTypeId ? "error" : ""
                }
                loading={isLandTypeLoading || isLandTypeFetching}
                options={landType?.data?.map((area) => ({
                  value: area.id,
                  label: lang === "ar" ? area.arName : area.name,
                }))}
                showSearch
                optionFilterProp="label"
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.LandTypeId && (
            <p>{errors.customerAddresses[index].LandTypeId.message}</p>
          )}
        </div>

        {/* INSECTS */}
        {/* <div>
          <label>{t("INSECTS")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.insects`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Insects?"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.insects ? "error" : ""
                }
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.insects && (
            <p>{errors.customerAddresses[index].insects.message}</p>
          )}
        </div> */}

        {/* RODENTS */}
        {/* <div>
          <label>{t("RODENTS")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.rodents`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Rodents?"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.rodents ? "error" : ""
                }
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.rodents && (
            <p>{errors.customerAddresses[index].rodents.message}</p>
          )}
        </div> */}

        {/* TOOLS */}
        {/* <div>
          <label>{t("TOOLS")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.tools`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter Tools"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.tools ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.tools && (
            <p>{errors.customerAddresses[index].tools.message}</p>
          )}
        </div> */}

        {/* MATERIAL WEIGHT */}
        {/* <div>
          <label>{t("MATERIAL_BY_GM")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.materialWeight`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
              pattern: {
                value: /^\d+(\.\d+)?$/,
                message: t("ONLY_NUMBER"),
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter material weight"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.materialWeight
                    ? "error"
                    : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.materialWeight && (
            <p>{errors.customerAddresses[index].materialWeight.message}</p>
          )}
        </div> */}

        {/* WINDOWS */}
        <div>
          <label>
            {t("NUMBER_OF_WINDOWS")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.numberOfWindows`}
            defaultValue={0}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Number of windows"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.numberOfWindows
                    ? "error"
                    : ""
                }
                defaultValue={0}
                options={Array.from({ length: 21 })?.map((_, index) => ({
                  label: index,
                  value: index,
                }))}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.numberOfWindows && (
            <p>{errors.customerAddresses[index].numberOfWindows.message}</p>
          )}
        </div>

        {/* Bed Rooms */}
        <div>
          <label>
            {t("NUMBER_OF_BEDROOMS")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.numberOfBedrooms`}
            defaultValue={0}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Number of bedrooms"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.numberOfBedrooms
                    ? "error"
                    : ""
                }
                defaultValue={0}
                options={Array.from({ length: 21 })?.map((_, index) => ({
                  label: index,
                  value: index,
                }))}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.numberOfBedrooms && (
            <p>{errors.customerAddresses[index].numberOfBedrooms.message}</p>
          )}
        </div>

        {/* Bath Rooms */}
        <div>
          <label>
            {t("NUMBER_OF_BATHROOMS")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.numberOfBathrooms`}
            defaultValue={0}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Number of bathrooms"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.numberOfBathrooms
                    ? "error"
                    : ""
                }
                defaultValue={0}
                options={Array.from({ length: 21 })?.map((_, index) => ({
                  label: index,
                  value: index,
                }))}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.numberOfBathrooms && (
            <p>{errors.customerAddresses[index].numberOfBathrooms.message}</p>
          )}
        </div>

        {/* Kitchen */}
        <div>
          <label>
            {t("NUMBER_OF_KITCHENS")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.numberOfKitchens`}
            defaultValue={0}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Number of kitchens"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.numberOfKitchens
                    ? "error"
                    : ""
                }
                defaultValue={0}
                options={Array.from({ length: 21 })?.map((_, index) => ({
                  label: index,
                  value: index,
                }))}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.numberOfKitchens && (
            <p>{errors.customerAddresses[index].numberOfKitchens.message}</p>
          )}
        </div>

        {/* Livingroom */}
        <div>
          <label>
            {t("NUMBER_OF_LIVINGROOMS")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.numberOfLivingRooms`}
            defaultValue={0}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Number of livingrooms"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.numberOfLivingRooms
                    ? "error"
                    : ""
                }
                defaultValue={0}
                options={Array.from({ length: 21 })?.map((_, index) => ({
                  label: index,
                  value: index,
                }))}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.numberOfLivingRooms && (
            <p>{errors.customerAddresses[index].numberOfLivingRooms.message}</p>
          )}
        </div>

        {/* Receptions */}
        <div>
          <label>
            {t("NUMBER_OF_RECIPTIONROOMS")}
            <Astrisk />
          </label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.numberOfReceptionrooms`}
            defaultValue={0}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Number of receptions"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.numberOfReceptionrooms
                    ? "error"
                    : ""
                }
                defaultValue={0}
                options={Array.from({ length: 21 })?.map((_, index) => ({
                  label: index,
                  value: index,
                }))}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.numberOfReceptionrooms && (
            <p>
              {errors.customerAddresses[index].numberOfReceptionrooms.message}
            </p>
          )}
        </div>

        {/* Landline */}
        <div>
          <label>{t("LANDLINE")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.landLine`}
            rules={{
              // required: { value: true, message: t("REQUIRED") },
              pattern: {
                value: /^[0-9]+$/,
                message: t("ONLY_NUMBER"),
              },
              minLength: { value: 7, message: t("MIN_LENGTH", { length: 7 }) },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter landline"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.landLine ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.landLine && (
            <p>{errors.customerAddresses[index].landLine.message}</p>
          )}
        </div>

        {/* Description */}
        {/* <div className="lg:col-span-2">
          <label>{t("DESCRIPTION")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.description`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Input
                {...field}
                variant="filled"
                placeholder="Enter description"
                className="placeholder:capitalize"
                status={
                  errors?.customerAddresses?.[index]?.description ? "error" : ""
                }
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.description && (
            <p>{errors.customerAddresses[index].description.message}</p>
          )}
        </div> */}

        {/* PETS */}
        <div className="">
          <div className="flex flex-col w-fit items-start gap-2">
            <label className="cursor-pointer w-fit" htmlFor="pets">
              {t("PETS")}
            </label>

            <Controller
              control={control}
              name={`customerAddresses.${index}.hasPets`}
              render={({ field }) => (
                <Checkbox
                  id="pets"
                  checked={!!field?.value}
                  {...field}
                  className="h-auto scale-150"
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </div>
        </div>

        {/* WORKERS */}
        {/* <div>
          <label>{t("NO_WORKERS")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.numberOfWorkers`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Number of workers"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.numberOfWorkers
                    ? "error"
                    : ""
                }
                options={Array.from({ length: 15 })?.map((_, index) => ({
                  label: index + 1,
                  value: index + 1,
                }))}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.numberOfWorkers && (
            <p>{errors.customerAddresses[index].numberOfWorkers.message}</p>
          )}
        </div> */}

        {/* BRIDE CLEAN */}
        {/* <div>
          <label>{t("BRIDE_CLEANS")}</label>
          <Controller
            control={control}
            name={`customerAddresses.${index}.brideCleansUp`}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <Select
                {...field}
                className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                placeholder="Bride cleans?"
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.brideCleansUp
                    ? "error"
                    : ""
                }
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.brideCleansUp && (
            <p>{errors.customerAddresses[index].brideCleansUp.message}</p>
          )}
        </div> */}

        {/* VISIT DURATION */}
        {/* <div>
          <label>{t("VISIT_DURATION")}</label>
          <Controller
            name={`customerAddresses.${index}.duration`}
            control={control}
            rules={{
              required: { value: true, message: t("REQUIRED") },
            }}
            render={({ field }) => (
              <RangePicker
                className="min-h-10 w-full border-[#C4C4C4] border rounded-md"
                showTime
                {...field}
                variant="filled"
                status={
                  errors?.customerAddresses?.[index]?.duration ? "error" : ""
                }
                value={
                  field.value
                    ? [
                        field.value[0] ? dayjs(field.value[0]).local() : null,
                        field.value[1] ? dayjs(field.value[1]).local() : null,
                      ]
                    : [null, null]
                }
                onChange={(values) => {
                  field.onChange(
                    values
                      ? values.map((v) => v?.format("YYYY-MM-DDTHH:mm:ss"))
                      : null
                  );
                }}
              />
            )}
          />
          {errors?.customerAddresses?.[index]?.duration && (
            <p>{errors.customerAddresses[index].duration.message}</p>
          )}
        </div> */}
      </section>

      {/* --------------------------------------- */}
      {/* Favourite List */}
      {/* --------------------------------------- */}
      <section className="fav-list-wrapper">
        <article className="col-span-full flex flex-col gap-2 capitalize text-xl text-[#1D1B1B] font-semibold">
          <div className="flex items-center gap-2 capitalize">
            <label>{t("FAVORITE_LIST")}</label>
            {/* <Astrisk /> */}
            <Button
              shape="circle"
              size="small"
              className="bg-green-600/20 text-green-600 border-none"
              icon={<FaPlus size={12} />}
              onClick={() => appendFavList({ value: "" })}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {favListFields?.map((field, index) => (
              <div key={field?.id}>
                <Controller
                  control={control}
                  name={`favoriteList.${index}.value`}
                  // rules={{
                  //   required: { value: true, message: t("REQUIRED") },
                  // }}
                  render={({ field }) => (
                    <Space.Compact className="items-stretch w-full">
                      <Input
                        {...field}
                        variant="filled"
                        placeholder="Enter Key word"
                        className={`placeholder:capitalize border-[#C4C4C4] border ${
                          favListFields?.length > 1
                            ? "rounded-s-md"
                            : "rounded-md"
                        } py-2 min-w-[250px]`}
                        status={
                          (
                            errors?.favoriteList?.[index] as unknown as {
                              value: string;
                            }
                          )?.value
                            ? "error"
                            : ""
                        }
                      />
                      <span>
                        {favListFields?.length > 1 ? (
                          <Button
                            icon={<FaMinus className="text-sm" />}
                            onClick={() => removeFavList(index)}
                            className="bg-red-500 text-white border-none size-full min-w-[30px] rounded-e-md"
                            shape="default"
                          />
                        ) : null}
                      </span>
                    </Space.Compact>
                  )}
                />
                {(
                  errors?.favoriteList?.[index] as unknown as {
                    value: {
                      message: string;
                    };
                  }
                )?.value?.message && (
                  <p className="text-red-500 text-xs mt-1 capitalize font-normal">
                    {
                      (
                        errors?.favoriteList?.[index] as unknown as {
                          value: {
                            message: string;
                          };
                        }
                      )?.value?.message
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* --------------------------------------- */}
      {/* Not Recommended Workers */}
      {/* --------------------------------------- */}

      <section className="not-recommeded-workers-wrapper">
        <article className="col-span-full flex flex-col gap-2 capitalize text-xl text-[#1D1B1B] font-semibold">
          <div className="flex items-center gap-2 capitalize">
            <label>{t("NOT_RECOMMENDED_WORKERS")}</label>
            {/* <Astrisk /> */}
            <Button
              shape="circle"
              size="small"
              className="bg-green-600/20 text-green-600 border-none"
              icon={<FaPlus size={12} />}
              onClick={() => appendNotRecommendedList({ value: "" })}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {notRecommendedListFields?.map((field, index) => (
              <div key={field?.id}>
                <Controller
                  control={control}
                  name={`NotRecommendedWorkerList.${index}.value`}
                  // rules={{
                  //   required: { value: true, message: t("REQUIRED") },
                  // }}
                  render={({ field }) => (
                    <Space.Compact className="items-stretch w-full">
                      <Input
                        {...field}
                        variant="filled"
                        placeholder="Enter not recommended worker"
                        className={`placeholder:capitalize border-[#C4C4C4] border ${
                          notRecommendedListFields?.length > 1
                            ? "rounded-s-md"
                            : "rounded-md"
                        } py-2 min-w-[250px]`}
                        status={
                          (
                            errors?.NotRecommendedWorkerList?.[
                              index
                            ] as unknown as {
                              value: string;
                            }
                          )?.value
                            ? "error"
                            : ""
                        }
                      />

                      <span>
                        {notRecommendedListFields?.length > 1 ? (
                          <Button
                            icon={<FaMinus className="text-sm" />}
                            onClick={() => removeNotRecommendedList(index)}
                            className="bg-red-500 text-white border-none size-full min-w-[30px] rounded-e-md"
                            shape="default"
                          />
                        ) : null}
                      </span>
                    </Space.Compact>
                  )}
                />
                {(
                  errors?.NotRecommendedWorkerList?.[index] as unknown as {
                    value: string;
                  }
                )?.value && (
                  <p className="text-red-500 text-xs mt-1 capitalize font-normal">
                    {
                      (
                        errors?.NotRecommendedWorkerList?.[
                          index
                        ] as unknown as {
                          value: string;
                        }
                      )?.value
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
};

export default AddressRow;
