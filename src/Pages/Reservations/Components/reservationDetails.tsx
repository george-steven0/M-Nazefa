import { useTranslation } from "react-i18next";
import Title from "../../../components/Common/Title/title";
import { Button, Modal, Select, type SelectProps } from "antd";
import { useState } from "react";
import type { DefaultOptionType } from "antd/es/select";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const ReservationDetails = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const id = params.get("id");

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setselectedOptions] = useState<
    DefaultOptionType | DefaultOptionType[] | undefined
  >([]);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleNavigateEdit = () => {
    navigate(`/reservations/edit-reservation?id=${id}`);
  };

  const handleTitleComponent = () => {
    return (
      <div className="flex flex-col gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
        <Button
          className="bg-mainColor text-white min-w-[200px]"
          onClick={toggleModal}
        >
          {t("ASSIGN_WORKERS")}
        </Button>
        <Button
          onClick={handleNavigateEdit}
          className="w-fit text-mainColor border-0 border-b rounded-none shadow-none border-mainColor bg-transparent"
        >
          {t("EDIT_RESERVATION")}
        </Button>
      </div>
    );
  };

  // Select Change Handler
  const options: SelectProps["options"] = [
    {
      value: "1",
      label: "worker 1",
    },
    {
      value: "2",
      label: "worker 2",
    },
    {
      value: "3",
      label: "worker 3",
    },
    {
      value: "4",
      label: "worker 4",
    },
    {
      value: "5",
      label: "worker 5",
    },
    {
      value: "6",
      label: "worker 6",
    },
    {
      value: "7",
      label: "worker 7",
    },
    {
      value: "8",
      label: "worker 8",
    },
    {
      value: "9",
      label: "worker 9",
    },
    {
      value: "10",
      label: "worker 10",
    },
  ];
  const handleChange = (
    _value: string[],
    obj: DefaultOptionType | DefaultOptionType[] | undefined
  ) => {
    setselectedOptions(obj);
  };

  // console.log(selectedOptions);

  return (
    <>
      <main>
        <header>
          <Title
            title={t("CUSTOMER_RESERVATION_DETAILS")}
            subTitle
            component={handleTitleComponent()}
            className={"items-start"}
          />
        </header>

        <div className="flex flex-col gap-8">
          <section className="personal-info-wrapper capitalize flex flex-col gap-4">
            <div className="title-wrapper">
              <p className="text-xl font-semibold text-mainTextDark">
                {t("CUSTOMER_INFO")}
              </p>
            </div>

            <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[50%] grid grid-cols-1 gap-y-4 [&>div]:grid [&>div]:grid-cols-2 [&>div]:gap-x-3 [&>div]:pb-2 [&>div:last-child]:border-none [&>div]:border-b [&>div]:border-dashed [&>div]:border-[#A2A2A2] [&>div>span]:font-normal [&>div>span]:text-[18px] [&>div>span:first-child]:text-[#1D1B1B] [&>div>span:last-child]:text-[#646363] ">
              <div>
                <span>{t("FULL_NAME")}</span>
                <span>Hany Samir</span>
              </div>

              <div>
                <span>{t("ID_NUMBER")}</span>
                <span>456465458654565645</span>
              </div>

              <div>
                <span>{t("PHONE_NUMBER")}</span>
                <span>+25545645646</span>
              </div>

              <div>
                <span>{t("EMAIL")}</span>
                <span>test@email.com</span>
              </div>
            </div>
          </section>

          <section className="address-info-wrapper capitalize flex flex-col gap-4">
            <div className="title-wrapper">
              <p className="text-xl font-semibold text-mainTextDark">
                {t("ADDRESS")}
              </p>
            </div>

            <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[50%] grid grid-cols-1 gap-y-4 [&>div]:grid [&>div]:grid-cols-2 [&>div]:gap-x-3 [&>div]:pb-2 [&>div:last-child]:border-none [&>div]:border-b [&>div]:border-dashed [&>div]:border-[#A2A2A2] [&>div>span]:font-normal [&>div>span]:text-[18px] [&>div>span:first-child]:text-[#1D1B1B] [&>div>span:last-child]:text-[#646363] ">
              <div>
                <span>{t("CITY")}</span>
                <span>Alexandria</span>
              </div>

              <div>
                <span>{t("AREA")}</span>
                <span>Sidi beshr</span>
              </div>

              <div>
                <span>{t("STREET")}</span>
                <span>Miami St</span>
              </div>

              <div>
                <span>{t("APARTMENT")}</span>
                <span>105</span>
              </div>

              <div>
                <span>{t("FLOOR")}</span>
                <span>3</span>
              </div>

              <div>
                <span>{t("POSTAL_CODE")}</span>
                <span>35568</span>
              </div>
            </div>
          </section>

          <section className="appointment-info-wrapper capitalize flex flex-col gap-4">
            <div className="title-wrapper">
              <p className="text-xl font-semibold text-mainTextDark">
                {t("APPOINTMENT")}
              </p>
            </div>

            <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[50%] grid grid-cols-1 gap-y-4 [&>div]:grid [&>div]:grid-cols-2 [&>div]:gap-x-3 [&>div]:pb-2 [&>div:last-child]:border-none [&>div]:border-b [&>div]:border-dashed [&>div]:border-[#A2A2A2] [&>div>span]:font-normal [&>div>span]:text-[18px] [&>div>span:first-child]:text-[#1D1B1B] [&>div>span:last-child]:text-[#646363] ">
              <div>
                <span>{t("DATE")}</span>
                <span>26/11/2025</span>
              </div>

              <div>
                <span>{t("FROM_TIME")}</span>
                <span>10:00</span>
              </div>

              <div>
                <span>{t("TO_TIME")}</span>
                <span>12:00</span>
              </div>
            </div>
          </section>

          <section className="BULDING-info-wrapper capitalize flex flex-col gap-4">
            <div className="title-wrapper">
              <p className="text-xl font-semibold text-mainTextDark">
                {t("BUILDING_DETAILS")}
              </p>
            </div>

            <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[50%] grid grid-cols-1 gap-y-4 [&>div]:grid [&>div]:grid-cols-2 [&>div]:gap-x-3 [&>div]:pb-2 [&>div:last-child]:border-none [&>div]:border-b [&>div]:border-dashed [&>div]:border-[#A2A2A2] [&>div>span]:font-normal [&>div>span]:text-[18px] [&>div>span:first-child]:text-[#1D1B1B] [&>div>span:last-child]:text-[#646363] ">
              <div>
                <span>{t("SPACE")}</span>
                <span>215m</span>
              </div>

              <div>
                <span>{t("BUILDING_TYPE")}</span>
                <span>Apartment</span>
              </div>

              <div>
                <span>{t("STATE")}</span>
                <span>alexandria</span>
              </div>

              <div>
                <span>{t("LAND_TYPE")}</span>
                <span>----</span>
              </div>

              <div>
                <span>{t("INSECTS")}</span>
                <span>yes</span>
              </div>

              <div>
                <span>{t("RODENTS")}</span>
                <span>yes</span>
              </div>

              <div>
                <span>{t("TOOLS")}</span>
                <span>Unknown</span>
              </div>

              <div>
                <span>{t("MATERIAL_BY_GM")}</span>
                <span>666 GM</span>
              </div>

              <div>
                <span>{t("NUMBER_OF_WINDOWS")}</span>
                <span>12</span>
              </div>

              <div>
                <span>{t("NUMBER_OF_WORKERS")}</span>
                <span>4</span>
              </div>

              <div>
                <span>{t("BRIDE_CLEANS")}</span>
                <span>yes</span>
              </div>

              <div>
                <span>{t("VISIT_DURATION")}</span>
                <span>6 hours</span>
              </div>
            </div>
          </section>

          <section className="extra-services-info-wrapper capitalize flex flex-col gap-4">
            <div className="title-wrapper">
              <p className="text-xl font-semibold text-mainTextDark">
                {t("EXTRA_SERVICE")}
              </p>
            </div>

            <div className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[50%] grid grid-cols-1 gap-y-4 [&>div]:grid [&>div]:grid-cols-2 [&>div]:gap-x-3 [&>div]:pb-2 [&>div:last-child]:border-none [&>div]:border-b [&>div]:border-dashed [&>div]:border-[#A2A2A2] [&>div>span]:font-normal [&>div>span]:text-[18px] [&>div>span:first-child]:text-[#1D1B1B] [&>div>span:last-child]:text-[#646363] ">
              <div>
                <span>{t("EXTRA_BATHROOM")}</span>
                <span>yes</span>
              </div>

              <div>
                <span>{t("CLEAN_KITCHEN")}</span>
                <span>yes</span>
              </div>

              <div>
                <span>{t("BUYING_TOOLS")}</span>
                <span>yes</span>
              </div>

              <div>
                <span>{t("EXTRA_MATERIAL")}</span>
                <span>no</span>
              </div>

              <div>
                <span>{t("EXTRA_WORKERS")}</span>
                <span>no</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Modal
        title={t("ASSIGN_WORKERS")}
        closable={{ "aria-label": "lose Button" }}
        open={isModalOpen}
        onOk={toggleModal}
        onCancel={toggleModal}
        loading={false}
        zIndex={999999}
        footer={
          <div className="flex justify-center gap-2">
            <Button
              className="md:min-w-[170px] bg-mainColor text-white capitalize py-4"
              onClick={toggleModal}
            >
              {t("SAVE")}
            </Button>
          </div>
        }
      >
        <section className="assign-workers-select-wrapper my-8">
          <div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select worker"
              value={selectedOptions?.map(
                (worker: DefaultOptionType) => worker.value
              )}
              //   defaultValue={['a10', 'c12']}
              onChange={handleChange}
              options={options}
            />
          </div>

          <div className="selected-options-wrapper mt-4 max-h-[250px] overflow-y-auto">
            <ul className="flex flex-col gap-2 list-disc capitalize">
              {selectedOptions?.map((worker: DefaultOptionType) => (
                <li
                  key={worker.value}
                  className="grid grid-cols-2 gap-8 md:max-w-[300px] hover:bg-mainColor/10 p-1 px-4 rounded-md"
                >
                  <span>{worker.label}</span>
                  <span
                    className="cursor-pointer w-fit text-right"
                    onClick={() => {
                      setselectedOptions(
                        selectedOptions?.filter(
                          (item: DefaultOptionType) =>
                            item.value !== worker.value
                        )
                      );
                    }}
                  >
                    <FaTrash size={15} color="red" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Modal>
    </>
  );
};

export default ReservationDetails;
