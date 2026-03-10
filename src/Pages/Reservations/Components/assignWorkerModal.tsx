import { Button, Modal, Select, Typography, type SelectProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import type { assignWorkerFormProps } from "../../../components/Utilities/Types/types";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
  type UseFormReset,
  type UseFormSetValue,
} from "react-hook-form";

const options: SelectProps["options"] = [
  { value: "1", label: "worker 1" },
  { value: "2", label: "worker 2" },
  { value: "3", label: "worker 3" },
  { value: "4", label: "worker 4" },
  { value: "5", label: "worker 5" },
  { value: "6", label: "worker 6" },
  { value: "7", label: "worker 7" },
  { value: "8", label: "worker 8" },
  { value: "9", label: "worker 9" },
  { value: "10", label: "worker 10" },
  { value: "11", label: "worker 11" },
];

type assignworkerProps = {
  open: boolean;
  close: () => void;
  onConfirm: (data: assignWorkerFormProps) => void;
  control: Control<assignWorkerFormProps>;
  handleSubmit: UseFormHandleSubmit<assignWorkerFormProps>;
  errors: FieldErrors<assignWorkerFormProps>;
  setValue: UseFormSetValue<assignWorkerFormProps>;
  reset: UseFormReset<assignWorkerFormProps>;
};

export default function AssignWorkerModal({
  open,
  close,
  onConfirm,
  control,
  handleSubmit,
  errors,
  setValue,
  reset,
}: assignworkerProps) {
  const { t } = useTranslation();

  const [selectedOptions, setselectedOptions] = useState<
    DefaultOptionType | DefaultOptionType[] | undefined
  >([]);

  const handleChange = (
    _value: string[],
    obj: DefaultOptionType | DefaultOptionType[] | undefined,
  ) => {
    setselectedOptions(obj);
  };
  const { Text, Title: TypographyTitle } = Typography;

  const handleDeleteOption = (value: string | number | null | undefined) => {
    if (!Array.isArray(selectedOptions)) return;
    const filteredData = selectedOptions.filter(
      (worker) => worker.value !== value,
    );

    setselectedOptions(filteredData);

    const formattedData = filteredData.map((worker) => ({
      workerId: worker.value as string | number,
    }));
    setValue("workers", formattedData);
  };

  const handleCloseModal = () => {
    close();
    reset();
    setselectedOptions([]);
  };
  //   console.log(errors);
  return (
    <>
      <Modal
        title={t("ASSIGN_WORKERS")}
        open={open}
        // onOk={close}
        onCancel={handleCloseModal}
        zIndex={99}
        className="rounded-3xl overflow-hidden"
        footer={null}
      >
        <form onSubmit={handleSubmit(onConfirm)} className="my-4">
          <div className="mb-6">
            <p className="mb-2 block">
              {t("SELECT_WORKERS_DESCRIPTION") ||
                "Search and select workers to assign to this reservation"}
            </p>
            <Controller
              name="workers"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t("REQUIRED"),
                },
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  mode="multiple"
                  allowClear
                  className="w-full h-auto [&_.ant-select-selector]:py-2"
                  placeholder={t("SELECT_WORKER") || "Please select worker"}
                  value={field.value?.map(
                    (worker: DefaultOptionType) => worker.workerId,
                  )}
                  onChange={(values, obj) => {
                    handleChange(values, obj);
                    const formattedData = values.map((id) => ({
                      workerId: id,
                    }));

                    field.onChange(formattedData);
                  }}
                  options={options}
                />
              )}
            />

            {errors.workers && (
              <p className="text-red-500 text-xs mt-2">
                {errors.workers.message}
              </p>
            )}
          </div>

          <div className="mt-4 max-h-[300px] overflow-y-auto">
            <TypographyTitle
              level={5}
              className="text-sm! text-gray-400! mb-3! uppercase tracking-widest"
            >
              {t("SELECTED_WORKERS") || "Selected Workers"}
            </TypographyTitle>
            <div className="flex flex-col gap-2">
              {selectedOptions?.length > 0 ? (
                selectedOptions?.map((worker: DefaultOptionType) => (
                  <div
                    key={worker?.value}
                    className="flex justify-between items-center bg-gray-50 p-3 px-4 rounded-xl border border-gray-100 hover:border-mainColor/30 transition-colors"
                  >
                    <span className="font-medium text-mainColor">
                      {worker?.label}
                    </span>
                    <Button
                      type="text"
                      danger
                      icon={<FaTrash />}
                      onClick={() => handleDeleteOption(worker?.value)}
                      className="flex items-center justify-center hover:bg-red-50"
                    />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <Text type="secondary">
                    {t("NO_WORKERS_SELECTED") || "No workers selected"}
                  </Text>
                </div>
              )}
            </div>
          </div>

          <section className="flex items-center justify-center w-full">
            <Button
              htmlType="submit"
              className="min-w-[150px] mt-4 bg-mainColor text-white h-12 rounded-xl text-lg font-semibold hover:bg-mainColor/90! transition-all shadow-md"
            >
              {t("SAVE")}
            </Button>
          </section>
        </form>
      </Modal>
    </>
  );
}
