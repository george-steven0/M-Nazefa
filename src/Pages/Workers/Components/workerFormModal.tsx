import { Modal, Button, Input, Select, Radio } from "antd";
import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type {
  APIErrorProps,
  workersFormProps,
} from "../../../components/Utilities/Types/types";
import {
  useAddWorkerMutation,
  useEditWorkerMutation,
} from "../../../components/APIs/Workers/WORKERS_QUERY";
import Astrisk from "../../../components/Common/Astrisk/astrisk";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

interface WorkerFormModalProps {
  open: boolean;
  close: () => void;
  data?: workersFormProps;
}

type WorkerFormValues = {
  name: string;
  arName: string;
  nationalId: string;
  isMale: string | undefined;
  isWorker: string | undefined;
  phoneNumbers: { number: string }[];
};

const WorkerFormModal = ({ open, close, data }: WorkerFormModalProps) => {
  const { t } = useTranslation();

  const id = data?.id || null;

  const [addWorker, { isLoading: addLoading }] = useAddWorkerMutation();
  const [editWorker, { isLoading: editLoading }] = useEditWorkerMutation();

  const defaultValues: WorkerFormValues = {
    name: data?.name || "",
    arName: data?.arName || "",
    nationalId: data?.nationalId || "",
    isMale: data?.isMale !== undefined ? String(data?.isMale) : undefined,
    isWorker: data?.isWorker !== undefined ? String(data?.isWorker) : undefined,
    phoneNumbers:
      data?.phoneNumbers && data.phoneNumbers.length > 0
        ? data.phoneNumbers.map((number) => ({ number }))
        : [{ number: "" }],
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkerFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phoneNumbers",
  });

  // Re-sync the form with the latest data whenever the modal is (re)opened,
  // otherwise react-hook-form keeps the values captured on first mount.
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data]);

  const onSubmit = async (formData: WorkerFormValues) => {
    const phoneNumbers = formData.phoneNumbers
      .map((p) => p.number.trim())
      .filter(Boolean);

    const payload: workersFormProps = {
      name: formData.name,
      arName: formData.arName,
      nationalId: formData.nationalId,
      isMale: formData.isMale === "true",
      isWorker: formData.isWorker === "true",
      phoneNumbers,
    };

    try {
      if (id) {
        await editWorker({ ...payload, id }).unwrap();
        toast.success(t("WORKER_EDITED_SUCCESS"));
      } else {
        await addWorker(payload).unwrap();
        toast.success(t("WORKER_ADDED_SUCCESS"));
      }
      handleClose();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };

  const handleClose = () => {
    close();
    reset();
  };

  return (
    <Modal
      title={
        <div className="text-xl capitalize mb-6">
          {id ? t("EDIT_WORKER") : t("ADD_WORKER")}
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium  [&>div>input]:border-[#C4C4C4] [&>div>input]:placeholder:capitalize [&>div>input]:py-2  [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium capitalize">
              {t("NAME_EN")} <Astrisk />
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t("REQUIRED"),
                },
                minLength: {
                  value: 3,
                  message: t("MIN_LENGTH", { length: 3 }),
                },
                pattern: {
                  value: /^[a-zA-Z ]+$/,
                  message: t("ENGLISH_LETTER"),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="filled"
                  status={errors.name ? "error" : ""}
                  placeholder={t("NAME_EN")}
                  className="py-2"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Arabic Name */}
          <div>
            <label className="block mb-1 font-medium capitalize">
              {t("NAME_AR")} <Astrisk />
            </label>
            <Controller
              name="arName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t("REQUIRED"),
                },
                minLength: {
                  value: 3,
                  message: t("MIN_LENGTH", { length: 3 }),
                },
                pattern: {
                  value: /^[؀-ۿ ]+$/,
                  message: t("ARABIC_LETTER"),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="filled"
                  status={errors.arName ? "error" : ""}
                  placeholder={t("NAME_AR")}
                  className="py-2"
                />
              )}
            />
            {errors.arName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.arName.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium capitalize">
              {t("GENDER")} <Astrisk />
            </label>
            <Controller
              name="isMale"
              control={control}
              rules={{ required: t("REQUIRED") }}
              render={({ field }) => (
                <Select
                  {...field}
                  variant="filled"
                  status={errors.isMale ? "error" : ""}
                  placeholder={t("GENDER")}
                  className="w-full h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                  options={[
                    { value: "true", label: t("MALE") },
                    { value: "false", label: t("FEMALE") },
                  ]}
                />
              )}
            />
            {errors.isMale && (
              <p className="text-red-500 text-xs mt-1">
                {errors.isMale.message}
              </p>
            )}
          </div>

          {/* Worker Type */}
          <div>
            <label className="block mb-1 font-medium capitalize">
              {t("WORKER_TYPE")} <Astrisk />
            </label>
            <Controller
              name="isWorker"
              control={control}
              rules={{ required: t("REQUIRED") }}
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  className="flex items-center gap-4 h-10"
                >
                  <Radio value="true">{t("WORKER")}</Radio>
                  <Radio value="false">{t("SUPERVISOR")}</Radio>
                </Radio.Group>
              )}
            />
            {errors.isWorker && (
              <p className="text-red-500 text-xs mt-1">
                {errors.isWorker.message}
              </p>
            )}
          </div>

          {/* National ID */}
          <div className="col-span-full">
            <label className="block mb-1 font-medium capitalize">
              {t("ID_NUMBER")} <Astrisk />
            </label>
            <Controller
              name="nationalId"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t("REQUIRED"),
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: t("ONLY_NUMBER"),
                },
                minLength: {
                  value: 14,
                  message: t("MIN_LENGTH", { length: 14 }),
                },
                maxLength: {
                  value: 14,
                  message: t("MAX_LENGTH", { length: 14 }),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  variant="filled"
                  status={errors.nationalId ? "error" : ""}
                  placeholder={t("ID_NUMBER")}
                  className="py-2"
                  maxLength={14}
                  minLength={14}
                />
              )}
            />
            {errors.nationalId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nationalId.message}
              </p>
            )}
          </div>

          {/* Phone Numbers (dynamic) */}
          <div className="col-span-full">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium capitalize">
                {t("PHONE_NUMBERS")} <Astrisk />
              </label>
              <Button
                type="dashed"
                size="small"
                icon={<AiOutlinePlus />}
                onClick={() => append({ number: "" })}
                className="capitalize"
              >
                {t("ADD_PHONE")}
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Controller
                      name={`phoneNumbers.${index}.number`}
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: t("REQUIRED"),
                        },
                        pattern: {
                          value: /^[0-9+]+$/,
                          message: t("ONLY_NUMBER"),
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          variant="filled"
                          status={
                            errors.phoneNumbers?.[index]?.number ? "error" : ""
                          }
                          placeholder={t("PHONE_NUMBER")}
                          className="py-2"
                        />
                      )}
                    />
                    <Button
                      danger
                      shape="circle"
                      icon={<AiOutlineDelete />}
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    />
                  </div>
                  {errors.phoneNumbers?.[index]?.number && (
                    <p className="text-red-500 text-xs">
                      {errors.phoneNumbers?.[index]?.number?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 gap-2">
          <Button
            disabled={addLoading || editLoading}
            onClick={handleClose}
            className="capitalize"
          >
            {t("CLOSE")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-mainColor capitalize"
            loading={addLoading || editLoading}
          >
            {t("SUBMIT")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WorkerFormModal;
