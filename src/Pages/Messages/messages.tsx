import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { Controller, useForm } from "react-hook-form";
import type {
  APIErrorProps,
  messagesProps,
} from "../../components/Utilities/Types/types";
import { Button, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useGetAllCustomersDDLQuery } from "../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import { useAppSelector } from "../../components/APIs/store";
import { useSendMessageMutation } from "../../components/APIs/Message/MESSAGE_QUERY";
import { toast } from "react-toastify";

const Messages = () => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state?.lang);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<messagesProps>();

  const { data: customers } = useGetAllCustomersDDLQuery();

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  // console.log(customers);

  const handleFormSubmit = async (data: messagesProps) => {
    try {
      await sendMessage(data).unwrap();
      toast.success(t("MESSAGE_SENT_SUCCESSFULLY"));
      reset();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
      // console.log(err?.data);
    }
  };

  const customerOptions = customers?.data?.map((customer) => ({
    value: customer.id,
    label: lang === "ar" ? customer?.arName : customer?.name,
  }));

  return (
    <main>
      <header>
        <Title title={t("MESSAGES")} />
      </header>
      <section className="mt-12">
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4  [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>textarea]:border-[#C4C4C4] [&>div>textarea]:py-2 [&>div>textarea]:resize-none [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
            <div className="col-span-full">
              <label>{t("SELECT_CUSTOMER")}</label>
              <Controller
                control={control}
                name="customerIds"
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize [&>.ant-select-selector]:h-full [&_.ant-select-selection-wrap]:h-full"
                    variant="filled"
                    status={errors?.customerIds ? "error" : ""}
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please Select Customer"
                    showSearch
                    optionFilterProp="label"
                    onChange={(e) => {
                      field.onChange(e);
                      //   handleChange(e);
                    }}
                    options={customerOptions}
                  />
                )}
              />

              {errors?.customerIds ? (
                <p>{errors?.customerIds?.message}</p>
              ) : null}
            </div>

            {/* <div>
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
            </div> */}

            <div className="col-span-full">
              <label>{t("MESSAGE")}</label>
              <Controller
                name="message"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
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
              loading={isLoading}
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
