import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button, Input, Select, TimePicker } from "antd";
import type { clientFormPropsType } from "../../../components/Utilities/Types/types";
import dayjs from "dayjs";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const EditClient = () => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<clientFormPropsType>({
    defaultValues: {
      customerAddresses: [
        {
          cityId: "",
          areaId: "",
          street: "",
          apartment: "",
          floor: "",
          postalCode: "",
          landmark: "",
          fullDescription: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "customerAddresses",
    control: control,
    rules: {
      required: {
        value: true,
        message: t("REQUIRED"),
      },
    },
  });

  const handleRemoveAddress = (index: number) => {
    remove(index);
  };

  const handleAddAddress = () => {
    append({
      cityId: "",
      areaId: "",
      street: "",
      apartment: "",
      floor: "",
      postalCode: "",
      landmark: "",
      fullDescription: "",
      space: "",
      buildType: "",
      states: "",
      landType: "",
      insects: "",
      rodents: "",
      tools: "",
      materialWeight: "",
      numberOfWindows: "",
      numberOfWorkers: "",
      brideClean: "",
      duration: ["", ""],
    });
  };

  const handleFormSubmit = (data: clientFormPropsType) => {
    console.log(data);
  };
  return (
    <div className="add-client-wrapper">
      <section className="add-client-title-wrapper">
        <Title title={t("EDIT_CLIENT")} subTitle />
      </section>

      <section className="mt-8 form-wrapper">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-wrap flex-col gap-10 [&>section]:grid [&>section]:grid-cols-1 [&>section]:md:grid-cols-2 [&>section]:lg:grid-cols-3 [&>section]:gap-5 [&>section>div>label]:block [&>section>div>label]:mb-1 [&>section>div>label]:capitalize [&>section>div>label]:font-medium [&>section>div>input]:border-[#C4C4C4] [&>section>div>input]:py-2 [&>section>div>p]:mt-1 [&>section>div>p]:text-xs [&>section>div>p]:capitalize [&>section>div>p]:text-mainRed"
          noValidate
        >
          <section className="personal-info-section">
            <article className="personal-title capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
              {t("PERSONAL_INFO")}
            </article>

            <div>
              <label>{t("FIRST_NAME")}</label>
              <Controller
                control={control}
                name="firstName"
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
                    placeholder="Enter first name"
                    className="placeholder:capitalize"
                    status={errors?.firstName ? "error" : ""}
                  />
                )}
              />

              {errors?.firstName ? <p>{errors?.firstName?.message}</p> : null}
            </div>

            <div>
              <label>{t("MIDDLE_NAME")}</label>
              <Controller
                control={control}
                name="middleName"
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
                    placeholder="Enter middle name"
                    className="placeholder:capitalize"
                    status={errors?.middleName ? "error" : ""}
                  />
                )}
              />

              {errors?.middleName ? <p>{errors?.middleName?.message}</p> : null}
            </div>

            <div>
              <label>{t("LAST_NAME")}</label>
              <Controller
                control={control}
                name="lastName"
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
                    placeholder="Enter last name"
                    className="placeholder:capitalize"
                    status={errors?.lastName ? "error" : ""}
                  />
                )}
              />

              {errors?.lastName ? <p>{errors?.lastName?.message}</p> : null}
            </div>

            <div>
              <label>{t("ID_NUMBER")}</label>
              <Controller
                control={control}
                name="idNumber"
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
                    placeholder="Enter id number"
                    className="placeholder:capitalize"
                    status={errors?.idNumber ? "error" : ""}
                  />
                )}
              />

              {errors?.idNumber ? <p>{errors?.idNumber?.message}</p> : null}
            </div>

            <div>
              <label>{t("PHONE_NUMBER")}</label>
              <Controller
                control={control}
                name="phoneNumber"
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
                    placeholder="Enter phone number"
                    className="placeholder:capitalize"
                    status={errors?.phoneNumber ? "error" : ""}
                  />
                )}
              />

              {errors?.phoneNumber ? (
                <p>{errors?.phoneNumber?.message}</p>
              ) : null}
            </div>

            <div>
              <label>{t("EMAIL")}</label>
              <Controller
                control={control}
                name="email"
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
                    placeholder="Enter email"
                    className="placeholder:capitalize"
                    status={errors?.email ? "error" : ""}
                  />
                )}
              />

              {errors?.email ? <p>{errors?.email?.message}</p> : null}
            </div>
          </section>

          <div className="col-span-full">
            <article className="personal-title flex items-center gap-4 mb-4 capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
              {t("ADDRESSES")}
              <Button
                icon={<FaPlus />}
                onClick={handleAddAddress}
                className="bg-green-600 text-white border-none"
                shape="circle"
              />
            </article>

            <div className="flex flex-col gap-5">
              {fields?.map((address, index) => (
                <div
                  key={address.id}
                  className="flex flex-wrap flex-col gap-10 [&>section]:grid [&>section]:grid-cols-1 [&>section]:md:grid-cols-2 [&>section]:lg:grid-cols-3 [&>section]:gap-5 [&>section>div>label]:block [&>section>div>label]:mb-1 [&>section>div>label]:capitalize [&>section>div>label]:font-medium [&>section>div>input]:border-[#C4C4C4] [&>section>div>input]:py-2 [&>section>div>select]:border-[#C4C4C4] [&>section>div>select]:py-2 [&>section>div>select]:w-full [&>section>div>p]:mt-1 [&>section>div>p]:text-xs [&>section>div>p]:capitalize [&>section>div>p]:text-mainRed"
                >
                  <section className="address-info-section">
                    <article className="flex items-center gap-5 personal-title capitalize col-span-full text-xl text-[#1D1B1B] font-semibold">
                      <span>
                        {t("ADDRESS")} #{index + 1}
                      </span>
                      {fields?.length <= 1 ? null : (
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
                      <label>{t("CITY")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.cityId`}
                        rules={{
                          required: { value: true, message: t("REQUIRED") },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            variant="filled"
                            placeholder="Enter city"
                            className="placeholder:capitalize"
                            status={
                              errors?.customerAddresses?.[index]?.cityId
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.cityId && (
                        <p>{errors.customerAddresses[index].cityId.message}</p>
                      )}
                    </div>

                    {/* AREA */}
                    <div>
                      <label>{t("AREA")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.areaId`}
                        rules={{
                          required: { value: true, message: t("REQUIRED") },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            variant="filled"
                            placeholder="Enter area"
                            className="placeholder:capitalize"
                            status={
                              errors?.customerAddresses?.[index]?.areaId
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.areaId && (
                        <p>{errors.customerAddresses[index].areaId.message}</p>
                      )}
                    </div>

                    {/* STREET */}
                    <div>
                      <label>{t("STREET")}</label>
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
                              errors?.customerAddresses?.[index]?.street
                                ? "error"
                                : ""
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
                      <label>{t("APARTMENT")}</label>
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
                              errors?.customerAddresses?.[index]?.apartment
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.apartment && (
                        <p>
                          {errors.customerAddresses[index].apartment.message}
                        </p>
                      )}
                    </div>

                    {/* FLOOR */}
                    <div>
                      <label>{t("FLOOR")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.floor`}
                        rules={{
                          required: { value: true, message: t("REQUIRED") },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            variant="filled"
                            placeholder="Enter floor number"
                            className="placeholder:capitalize"
                            status={
                              errors?.customerAddresses?.[index]?.floor
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.floor && (
                        <p>{errors.customerAddresses[index].floor.message}</p>
                      )}
                    </div>

                    {/* POSTAL CODE */}
                    <div>
                      <label>{t("POSTAL_CODE")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.postalCode`}
                        rules={{
                          required: { value: true, message: t("REQUIRED") },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            variant="filled"
                            placeholder="Enter postal code"
                            className="placeholder:capitalize"
                            status={
                              errors?.customerAddresses?.[index]?.postalCode
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.postalCode && (
                        <p>
                          {errors.customerAddresses[index].postalCode.message}
                        </p>
                      )}
                    </div>

                    {/* LANDMARK */}
                    <div>
                      <label>{t("LANDMARK")}</label>
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
                              errors?.customerAddresses?.[index]?.landmark
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.landmark && (
                        <p>
                          {errors.customerAddresses[index].landmark.message}
                        </p>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="col-span-full">
                      <label>{t("DESCRIPTION")}</label>
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
                              errors?.customerAddresses?.[index]
                                ?.fullDescription
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.fullDescription && (
                        <p>
                          {
                            errors.customerAddresses[index]?.fullDescription
                              .message
                          }
                        </p>
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
                      <label>{t("SPACE")}</label>
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
                              errors?.customerAddresses?.[index]?.space
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.space && (
                        <p>{errors.customerAddresses[index].space.message}</p>
                      )}
                    </div>

                    {/* BUILDING TYPE */}
                    <div>
                      <label>{t("BUILDING_TYPE")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.buildType`}
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
                              errors?.customerAddresses?.[index]?.buildType
                                ? "error"
                                : ""
                            }
                            options={[
                              { value: "1", label: "Apartment" },
                              { value: "2", label: "flat" },
                              { value: "3", label: "villa" },
                            ]}
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.buildType && (
                        <p>
                          {errors.customerAddresses[index].buildType.message}
                        </p>
                      )}
                    </div>

                    {/* STATE */}
                    <div>
                      <label>{t("STATE")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.states`}
                        rules={{
                          required: { value: true, message: t("REQUIRED") },
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className="min-h-10 border-[#C4C4C4] border rounded-md capitalize w-full"
                            placeholder="Select state"
                            variant="filled"
                            status={
                              errors?.customerAddresses?.[index]?.states
                                ? "error"
                                : ""
                            }
                            options={[
                              { value: "1", label: "Alexandria" },
                              { value: "2", label: "Gharbia" },
                              { value: "3", label: "Cairo" },
                            ]}
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.states && (
                        <p>{errors.customerAddresses[index].states.message}</p>
                      )}
                    </div>

                    {/* LAND TYPE */}
                    <div>
                      <label>{t("LAND_TYPE")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.landType`}
                        rules={{
                          required: { value: true, message: t("REQUIRED") },
                        }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            variant="filled"
                            placeholder="Enter land type"
                            className="placeholder:capitalize"
                            status={
                              errors?.customerAddresses?.[index]?.landType
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.landType && (
                        <p>
                          {errors.customerAddresses[index].landType.message}
                        </p>
                      )}
                    </div>

                    {/* INSECTS */}
                    <div>
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
                              errors?.customerAddresses?.[index]?.insects
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
                      {errors?.customerAddresses?.[index]?.insects && (
                        <p>{errors.customerAddresses[index].insects.message}</p>
                      )}
                    </div>

                    {/* RODENTS */}
                    <div>
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
                              errors?.customerAddresses?.[index]?.rodents
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
                      {errors?.customerAddresses?.[index]?.rodents && (
                        <p>{errors.customerAddresses[index].rodents.message}</p>
                      )}
                    </div>

                    {/* TOOLS */}
                    <div>
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
                              errors?.customerAddresses?.[index]?.tools
                                ? "error"
                                : ""
                            }
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.tools && (
                        <p>{errors.customerAddresses[index].tools.message}</p>
                      )}
                    </div>

                    {/* MATERIAL WEIGHT */}
                    <div>
                      <label>{t("MATERIAL_BY_GM")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.materialWeight`}
                        rules={{
                          required: { value: true, message: t("REQUIRED") },
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
                        <p>
                          {
                            errors.customerAddresses[index].materialWeight
                              .message
                          }
                        </p>
                      )}
                    </div>

                    {/* WINDOWS */}
                    <div>
                      <label>{t("NUMBER_OF_WINDOWS")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.numberOfWindows`}
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
                              errors?.customerAddresses?.[index]
                                ?.numberOfWindows
                                ? "error"
                                : ""
                            }
                            options={[
                              { value: "1-2", label: "1-2" },
                              { value: "3-6", label: "3-6" },
                              { value: "7+", label: "7+" },
                            ]}
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.numberOfWindows && (
                        <p>
                          {
                            errors.customerAddresses[index].numberOfWindows
                              .message
                          }
                        </p>
                      )}
                    </div>

                    {/* WORKERS */}
                    <div>
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
                              errors?.customerAddresses?.[index]
                                ?.numberOfWorkers
                                ? "error"
                                : ""
                            }
                            options={[
                              { value: "1-2", label: "1-2" },
                              { value: "3-6", label: "3-6" },
                              { value: "7+", label: "7+" },
                            ]}
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.numberOfWorkers && (
                        <p>
                          {
                            errors.customerAddresses[index].numberOfWorkers
                              .message
                          }
                        </p>
                      )}
                    </div>

                    {/* BRIDE CLEAN */}
                    <div>
                      <label>{t("BRIDE_CLEANS")}</label>
                      <Controller
                        control={control}
                        name={`customerAddresses.${index}.brideClean`}
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
                              errors?.customerAddresses?.[index]?.brideClean
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
                      {errors?.customerAddresses?.[index]?.brideClean && (
                        <p>
                          {errors.customerAddresses[index].brideClean.message}
                        </p>
                      )}
                    </div>

                    {/* VISIT DURATION */}
                    <div>
                      <label>{t("VISIT_DURATION")}</label>
                      <Controller
                        name={`customerAddresses.${index}.duration`}
                        control={control}
                        rules={{
                          required: { value: true, message: t("REQUIRED") },
                        }}
                        render={({ field }) => (
                          <TimePicker.RangePicker
                            className="min-h-10 w-full border-[#C4C4C4] border rounded-md"
                            variant="filled"
                            status={
                              errors?.customerAddresses?.[index]?.duration
                                ? "error"
                                : ""
                            }
                            value={
                              field.value
                                ? [
                                    field.value[0]
                                      ? dayjs(field.value[0])
                                      : null,
                                    field.value[1]
                                      ? dayjs(field.value[1])
                                      : null,
                                  ]
                                : [null, null]
                            }
                            onChange={(values) => {
                              field.onChange(
                                values
                                  ? values.map((v) => v?.toISOString())
                                  : null
                              );
                            }}
                          />
                        )}
                      />
                      {errors?.customerAddresses?.[index]?.duration && (
                        <p>
                          {errors.customerAddresses[index].duration.message}
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              ))}
            </div>
          </div>

          <div className="basis-full w-full flex items-center justify-center">
            <Button
              htmlType="submit"
              variant="outlined"
              className="w-fit min-w-40 py-4 capitalize border border-mainColor/20 bg-transparent text-mainColor hover:bg-mainColor hover:text-white"
            >
              {t("SUBMIT")}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditClient;
