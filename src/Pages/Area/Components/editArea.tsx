import { Button, Input, Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import type {
  APIErrorProps,
  areaFormProps,
} from "../../../components/Utilities/Types/types";
import type { TFunction } from "i18next";
import { toast } from "react-toastify";
import { useGetCitiesQuery } from "../../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import { useAppSelector } from "../../../components/APIs/store";
import { useEditAreaMutation } from "../../../components/APIs/Areas/AREAS_RTK_QUERY";
// import { useAddRoleMutation } from "../../../components/APIs/Roles/ROLE_QUERY";

type areaPropsType = {
  open: boolean;
  close: () => void;
  t: TFunction;
  data: areaFormProps;
};

const EditArea = ({ open, close, t, data }: areaPropsType) => {
  const { lang } = useAppSelector((state) => state?.lang);
  const [editArea, { isLoading }] = useEditAreaMutation();
  const {
    data: cities,
    isFetching: isCitiesFetching,
    isLoading: isCitiesLoading,
  } = useGetCitiesQuery();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<areaFormProps>({
    defaultValues: {
      id: data?.id,
      name: data?.name,
      arName: data?.arName,
      cityId: data?.cityId,
    },
  });

  const handleReset = () => {
    reset();
    close();
  };

  // console.log(errors);

  const submitForm = async (data: areaFormProps) => {
    // console.log(data);
    // const formattedData = {
    //   ...data,
    //   name: data?.name?.trim(),
    //   arName: data?.arName?.trim(),
    // };
    try {
      await editArea(data).unwrap();
      toast.success("area updated successfully");
      handleReset();
    } catch (error) {
      const err = error as APIErrorProps;
      // console.log(err);

      if (
        err?.data?.validationErrors &&
        err?.data?.validationErrors.length > 0
      ) {
        const errs =
          err?.data?.errorMessage && err?.data?.errorMessage.join("\n");
        toast.error(errs);
      } else {
        toast.error("Failed to update area");
      }
    }
  };
  return (
    <div>
      <Modal
        title={t("EDIT_AREA")}
        closable={{ "aria-label": "Close Button" }}
        open={open}
        // onOk={handleOk}
        onCancel={handleReset}
        footer
      >
        <form noValidate onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 gap-5 capitalize [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
            <div>
              <label>{t("CITY")}</label>
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
                    placeholder="Select customer type"
                    variant="filled"
                    status={errors?.cityId ? "error" : ""}
                    loading={isCitiesLoading || isCitiesFetching}
                    options={cities?.data?.map((city) => ({
                      value: city.id,
                      label: lang === "ar" ? city.arName : city.name,
                    }))}
                  />
                )}
              />

              {errors?.cityId ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.cityId?.message}
                </p>
              ) : null}
            </div>

            <div>
              <label>{t("AREA_NAME")}</label>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s]+$/,
                    message: t("ENGLISH_LETTER"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter area name (EN)"
                    className="placeholder:capitalize"
                    status={errors?.name ? "error" : ""}
                  />
                )}
              />

              {errors?.name ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.name?.message}
                </p>
              ) : null}
            </div>

            <div>
              <label>{t("AREA_AR_NAME")}</label>
              <Controller
                control={control}
                name="arName"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                  pattern: {
                    value: /^[\u0600-\u06FF0-9\s]+$/,
                    message: t("ARABIC_LETTER"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter area name (AR)"
                    className="placeholder:capitalize"
                    status={errors?.arName ? "error" : ""}
                  />
                )}
              />

              {errors?.arName ? (
                <p className="text-mainRed text-xs mt-1">
                  {errors?.arName?.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="w-full flex justify-between [&>button]:min-w-[120px] [&>button]:py-5 [&>button]:capitalize mt-8">
            <Button onClick={handleReset}>{t("CLOSE")}</Button>
            <Button
              htmlType="submit"
              className="bg-mainColor text-white border-none"
              loading={isLoading}
            >
              {t("SUBMIT")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EditArea;
