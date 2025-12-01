import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { Controller, useForm } from "react-hook-form";
import type { messagesProps } from "../../components/Utilities/Types/types";
import { Button, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

const Messages = () => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<messagesProps>();

  const handleFormSubmit = (data: messagesProps) => {
    console.log(data);
  };

  return (
    <main>
      <header>
        <Title title={t("MESSAGES")} />
      </header>
      <section className="mt-12">
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4  [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>textarea]:border-[#C4C4C4] [&>div>textarea]:py-2 [&>div>textarea]:resize-none [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
            <div>
              <label>{t("TITLE")}</label>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("required"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="filled"
                    placeholder="Enter title"
                    className="placeholder:capitalize"
                    status={errors?.title ? "error" : ""}
                  />
                )}
              />
              {errors?.title ? <p>{errors?.title?.message}</p> : null}
            </div>

            <div>
              <label>{t("SELECT_CUSTOMER")}</label>
              <Controller
                control={control}
                name="customerId"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="min-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                    variant="filled"
                    status={errors?.customerId ? "error" : ""}
                    // defaultValue="male"
                    style={{ width: "100%" }}
                    placeholder="Please Select Customer"
                    onChange={(e) => {
                      field.onChange(e);
                      //   handleChange(e);
                    }}
                    options={[
                      { value: "1", label: "customer 1" },
                      { value: "2", label: "customer 2" },
                      // { value: 'Yiminghe', label: 'yiminghe' },
                      // { value: 'disabled', label: 'Disabled', disabled: true },
                    ]}
                  />
                )}
              />

              {errors?.customerId ? <p>{errors?.customerId?.message}</p> : null}
            </div>

            <div className="col-span-full">
              <label>{t("MESSAGE")}</label>
              <Controller
                name="message"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("required"),
                  },
                }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    variant="filled"
                    placeholder="Enter message"
                    className="placeholder:capitalize min-h-[220px]"
                    status={errors?.message ? "error" : ""}
                  />
                )}
              />
              {errors?.message ? <p>{errors?.message?.message}</p> : null}
            </div>
          </section>

          <section className="submit-btn-wrapper mt-8 w-full flex justify-center">
            <Button
              htmlType="submit"
              className="bg-mainColor text-white py-5 min-w-[200px] capitalize"
            >
              {t("SEND_MESSAGE")}
            </Button>
          </section>
        </form>
      </section>
    </main>
  );
};

export default Messages;
