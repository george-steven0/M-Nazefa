import { Controller, useForm } from "react-hook-form";
import type { serviceFormProps } from "../../../components/Utilities/Types/types";
import Title from "../../../components/Common/Title/title";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Input, Select } from "antd";

const extraOptions = [
  "CLEANING_RESIDENTIAL",
  "CLEANING_ADMINISTRATIVE",
  "CLEANING_VILLAS_CHALETS",
  "CLEANING_POST_FINISHING",
  "DISINFECTION_STERILIZATION",
  "BRIDAL_HOME_SETUP",
  "DRY_CLEANING",
];

const EditService = () => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<serviceFormProps>();

  const handleFormSubmit = (data: serviceFormProps) => {
    console.log(data);
  };
  return (
    <main>
      <header>
        <Title title={t("EDIT_SERVICE")} subTitle />
      </header>

      <article className="service-form-wrapper mt-8">
        <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>div>label]:block [&>div>label]:mb-1 [&>div>label]:capitalize [&>div>label]:font-medium [&>div>input]:border-[#C4C4C4] [&>div>input]:py-2 [&>div>p]:mt-1 [&>div>p]:text-xs [&>div>p]:capitalize [&>div>p]:text-mainRed">
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
              <label>{t("SELECT_PACKAGE")}</label>
              <Controller
                control={control}
                name="package"
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
                    size="large"
                    className=" max-h-10 border-[#C4C4C4] border rounded-md capitalize [&>.ant-select-selector]:capitalize"
                    variant="filled"
                    status={errors?.package ? "error" : ""}
                    // defaultValue="male"
                    style={{ width: "100%" }}
                    placeholder="Please Select package"
                    onChange={(e) => {
                      field.onChange(e);
                      //   handleChange(e);
                    }}
                    options={[
                      { value: "1", label: "package 1" },
                      { value: "2", label: "package 2" },
                      // { value: 'Yiminghe', label: 'yiminghe' },
                      // { value: 'disabled', label: 'Disabled', disabled: true },
                    ]}
                  />
                )}
              />

              {errors?.package ? <p>{errors?.package?.message}</p> : null}
            </div>

            <div className="col-span-full">
              <label>{t("DESCRIPTION")}</label>
              <Controller
                name="description"
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
                    placeholder="Enter Description"
                    className="placeholder:capitalize min-h-[80px]"
                    status={errors?.description ? "error" : ""}
                  />
                )}
              />
              {errors?.description ? (
                <p>{errors?.description?.message}</p>
              ) : null}
            </div>

            <div className="col-span-full">
              <label>{t("EXTRA_SERVICE")}</label>

              <Controller
                name="extraId"
                control={control}
                defaultValue={[]}
                rules={{
                  required: {
                    value: true,
                    message: t("REQUIRED"),
                  },
                }}
                render={({ field }) => (
                  <div className="flex flex-col gap-4">
                    <Checkbox.Group
                      value={field.value || []}
                      onChange={(checkedValues) => {
                        field.onChange(checkedValues);

                        if (checkedValues.length === 0) {
                          setValue("extraDescription", "");
                        }
                      }}
                      className="flex flex-col gap-3 font-semibold"
                    >
                      {extraOptions.map((option, index) => (
                        <Checkbox
                          key={index}
                          value={index}
                          style={{ accentColor: "red" }}
                        >
                          {t(option)}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>

                    {field?.value && field?.value?.length > 0 && (
                      <Controller
                        name="extraDescription"
                        control={control}
                        defaultValue="" // also recommended
                        rules={{
                          required: {
                            value: true,
                            message: t("REQUIRED"),
                          },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            variant="filled"
                            placeholder={t("Enter description")}
                            className="mt-2 w-full min-h-[70px] border border-[#C4C4C4]"
                          />
                        )}
                      />
                    )}
                  </div>
                )}
              />
              {errors?.extraId ? <p>{errors?.extraId?.message}</p> : null}
            </div>
          </section>

          <section className="submit-btn-wrapper mt-8 w-full flex justify-center">
            <Button
              htmlType="submit"
              className="bg-mainColor text-white py-5 min-w-[200px] capitalize"
            >
              {t("UPDATE")}
            </Button>
          </section>
        </form>
      </article>
    </main>
  );
};

export default EditService;
