import type { TFunction } from "i18next";
import type {
  APIErrorProps,
  transportationFeesFormProps,
} from "../../../components/Utilities/Types/types";
import { Button, Input, Modal, Select } from "antd";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  useGetAreasQuery,
  useGetCitiesQuery,
} from "../../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import { skipToken } from "@reduxjs/toolkit/query";
import Astrisk from "../../../components/Common/Astrisk/astrisk";
import { useAppSelector } from "../../../components/APIs/store";
import { useEffect, useMemo } from "react";
import {
  useAddTransportationMutation,
  useEditTransportationMutation,
} from "../../../components/APIs/Transportations/TRANSPORTATION_QUERY";
import { toast } from "react-toastify";

type modalProps = {
  open: boolean;
  close: () => void;
  t: TFunction;
  data?: transportationFeesFormProps;
};

export default function TransportationForm({
  open,
  close,
  t,
  data,
}: modalProps) {
  const { lang } = useAppSelector((state) => state?.lang);
  const [addTransportation, { isLoading: isAdding }] =
    useAddTransportationMutation();
  const [editTransportation, { isLoading: isEditing }] =
    useEditTransportationMutation();

  const defaultValues = useMemo(() => {
    return {
      cityId: data?.cityId,
      areaId: data?.areaId,
      fee: data?.fee,
      id: data?.id,
    };
  }, [data]);

  // console.log(defaultValues);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<transportationFeesFormProps>({
    defaultValues: {
      cityId: "",
      areaId: "",
      fee: 0,
    },
  });

  useEffect(() => {
    if (open && data?.id) {
      reset(defaultValues);
    }
  }, [open, data?.id, reset, defaultValues]);

  // console.log(getValues());

  const {
    data: cities,
    isFetching: isCitiesFetching,
    isLoading: isCitiesLoading,
  } = useGetCitiesQuery({}, { skip: !open });

  const cityId = useWatch({
    control,
    name: "cityId",
  });
  // console.log(cityId);

  const {
    data: areas,
    isFetching: isAreasFetching,
    isLoading: isAreasLoading,
  } = useGetAreasQuery(cityId ? { cityId: cityId?.toString() } : skipToken);

  const submitForm = async (data: transportationFeesFormProps) => {
    try {
      if (data?.id) {
        await editTransportation(data).unwrap();
        toast.success(t("TRANSPORTATION_EDITED_SUCCESS"));
      } else {
        await addTransportation(data).unwrap();
        toast.success(t("TRANSPORTATION_ADDED_SUCCESS"));
      }
      handleReset();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
      // console.log(err?.data);
    }
  };

  const handleReset = () => {
    reset();
    close();
  };
  return (
    <div>
      <Modal
        title={
          data?.id ? t("EDIT_TRANSPORTATION_FEE") : t("ADD_TRANSPORTATION_FEE")
        }
        closable={{ "aria-label": "Close Button" }}
        open={open}
        // onOk={handleOk}
        onCancel={close}
        footer
      >
        <form noValidate onSubmit={handleSubmit(submitForm)}>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 capitalize [&>div>label]:capitalize [&>div>label]:block [&>div>label]:mb-1 [&>div>p]:text-red-500 [&>div>p]:capitalize [&>div>p]:text-xs [&>div>p]:mt-1">
            <div className="city-selector-wrapper">
              <label>
                {t("CITY")}
                <Astrisk />
              </label>

              <Controller
                control={control}
                name={`cityId`}
                rules={{
                  required: { value: true, message: t("REQUIRED") },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                    placeholder="Select city"
                    variant="filled"
                    status={errors?.cityId ? "error" : ""}
                    loading={isCitiesLoading || isCitiesFetching}
                    options={cities?.data?.map((city) => ({
                      value: city.id,
                      label: lang === "ar" ? city.arName : city.name,
                    }))}
                    showSearch
                    optionFilterProp="label"
                    onChange={(e) => {
                      field.onChange(e);
                      setValue(`areaId`, "");
                    }}
                    // notFoundContent={
                    //   <p className="text-red-500">{t("NOT_FOUND")}</p>
                    // }
                  />
                )}
              />
              {errors?.cityId && <p>{errors.cityId.message}</p>}
            </div>

            <div className="area-selector-wrapper">
              <label>
                {t("AREA")}
                <Astrisk />
              </label>

              <Controller
                control={control}
                name={`areaId`}
                rules={{
                  required: { value: true, message: t("REQUIRED") },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                    placeholder="Select area"
                    variant="filled"
                    status={errors?.areaId ? "error" : ""}
                    loading={isAreasLoading || isAreasFetching}
                    options={areas?.data?.map((area) => ({
                      value: area.id,
                      label: lang === "ar" ? area.arName : area.name,
                    }))}
                    showSearch
                    optionFilterProp="label"
                    disabled={isAreasLoading || isAreasFetching || !cityId}
                    // notFoundContent={
                    //   <p className="text-red-500">{t("NOT_FOUND")}</p>
                    // }
                  />
                )}
              />
              {errors?.areaId && <p>{errors.areaId.message}</p>}
            </div>

            <div className="fee-input-wrapper col-span-full">
              <label>
                {t("FEES")}
                <Astrisk />
              </label>
              <Controller
                control={control}
                name={`fee`}
                rules={{
                  required: { value: true, message: t("REQUIRED") },
                  min: { value: 0, message: t("MIN_FEE", { value: 0 }) },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="min-h-10 border-[#C4C4C4] border rounded-md w-full"
                    placeholder="Enter fee"
                    variant="filled"
                    status={errors?.fee ? "error" : ""}
                    type="number"
                    min={0}
                  />
                )}
              />
              {errors?.fee && <p>{errors.fee.message}</p>}
            </div>
          </section>

          <div className="w-full flex justify-between [&>button]:min-w-[120px] [&>button]:py-5 [&>button]:capitalize mt-8">
            <Button onClick={handleReset} disabled={isAdding || isEditing}>
              {t("CLOSE")}
            </Button>
            <Button
              htmlType="submit"
              className="bg-mainColor text-white border-none"
              loading={isAdding || isEditing}
            >
              {t("SUBMIT")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
