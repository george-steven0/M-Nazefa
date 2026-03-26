import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Title from "../../components/Common/Title/title";
import { useTranslation } from "react-i18next";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { Button, Table, type TableProps } from "antd";
import type {
  APIErrorProps,
  holdReservationProps,
  serviceFormProps,
} from "../../components/Utilities/Types/types";
import {
  useAddHoldReservationMutation,
  useGetAllReservationsQuery,
  useGetHoldReservationQuery,
} from "../../components/APIs/Reservations/RESERVATION_QUERY";
import dayjs from "dayjs";
import { AiOutlineEye } from "react-icons/ai";
import { useEffect, useState } from "react";
import HoldReservationModal from "./Components/holdReservationModal";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppSelector } from "../../components/APIs/store";
import { BsBoxSeam } from "react-icons/bs";
import { isAdmin, isSuperAdmin } from "../../Utilities/utilities";

const Actions = ({ data }: { data: serviceFormProps }) => {
  const navigate = useNavigate();
  //   const handleNavigateEdit = () => {
  //     navigate(`edit-reservation?id=${data?.id}`);
  //     console.log(data);
  //   };
  const handleNavigateView = () => {
    navigate(`reservation-details?id=${data?.id}`);
    // console.log(data);
  };
  return (
    <div className="flex items-center gap-2">
      {/* <Button
        shape="circle"
        className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        onClick={handleNavigateEdit}
        icon={<BiEdit size={20} />}
      /> */}
      <Button
        className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        shape="circle"
        onClick={handleNavigateView}
        icon={<AiOutlineEye size={20} />}
      />
    </div>
  );
};

export const Reservations = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { lang } = useAppSelector((state) => state?.lang);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<holdReservationProps>({
    defaultValues: {
      dateFrom: "",
      dateTo: "",
    },
  });

  // console.log(isDirty);

  const {
    data: reservations,
    isLoading,
    isFetching,
  } = useGetAllReservationsQuery();

  // console.log(reservations?.data);

  const navigate = useNavigate();

  const { SearchBox } = useSearchBox({
    placeholder: "Search Reservations",
  });

  const columns: TableProps<serviceFormProps>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Reservation Date",
      dataIndex: "reservationDate",
      key: "reservationDate",
      render: (text) => <span>{dayjs(text).format("DD-MM-YYYY hh:mm A")}</span>,
    },
    {
      title: "Reservation Amount",
      dataIndex: "reservationAmount",
      key: "reservationAmount",
      render: (text) => <p>{text} L.E</p>,
    },
    {
      title: t("NO_WORKERS"),
      dataIndex: "numberOfWorkers",
      key: "numberOfWorkers",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "General Comments",
      dataIndex: "generalComments",
      key: "generalComments",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Actions",
      render: (data) => <Actions data={data} />,
    },
  ];

  const data: serviceFormProps[] = reservations?.data || [];

  const handleNavigateAdd = () => {
    navigate(`/reservations/add-reservation`);
  };

  const handleTitleComponent = () => {
    return (
      <div className="flex gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
        <Button
          onClick={handleNavigateAdd}
          className="text-white bg-mainColor "
        >
          {t("ADD_RESERVATION")}
        </Button>

        {(isAdmin() || isSuperAdmin()) && (
          <Button
            onClick={openHoldReservationModal}
            className="text-white bg-mainOrange "
          >
            {t("AVAILABLE_APPOINTMENTS")}
          </Button>
        )}
      </div>
    );
  };

  // Hold Reservation Modal

  const [
    addHoldReservation,
    {
      isLoading: holdAddReservationLoading,
      // isSuccess: holdAddReservationSuccess,
    },
  ] = useAddHoldReservationMutation();

  const {
    data: holdReservation,
    isLoading: holdReservationLoading,
    isFetching: holdReservationIsFetching,
    isSuccess: holdReservationSuccess,
  } = useGetHoldReservationQuery();

  // console.log(holdReservation);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openHoldReservationModal = () => {
    setIsModalOpen(true);
  };

  const closeHoldReservationModal = () => {
    setIsModalOpen(false);
  };

  // console.log(holdReservationSuccess);

  useEffect(() => {
    if (isModalOpen && holdReservationSuccess) {
      reset({
        dateFrom: holdReservation?.data?.[0]?.dateFrom,
        dateTo: holdReservation?.data?.[0]?.dateTo,
      });
    }
  }, [holdReservation?.data, holdReservationSuccess, reset, isModalOpen]);

  const handleHoldReservationSubmit = async (data: holdReservationProps) => {
    // console.log(data);

    const formData = {
      dateFrom: dayjs(data.dateFrom).format("YYYY-MM-DDThh:mm:ss[Z]"),
      dateTo: dayjs(data.dateTo).format("YYYY-MM-DDThh:mm:ss[Z]"),
    };

    // console.log(formData);

    try {
      await addHoldReservation(formData).unwrap();
      closeHoldReservationModal();
      toast.success("Available Appointments Updated Successfully");
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
        toast.error("Failed to update available appointments");
      }
    }
  };

  const isChildClientPage =
    pathname.includes("add-reservation") ||
    pathname.includes("edit-reservation") ||
    pathname.includes("reservation-details");

  if (isChildClientPage) {
    return <Outlet />;
  }
  return (
    <main>
      <header>
        <Title title={t("RESERVATIONS")} component={handleTitleComponent()} />
      </header>

      <div>
        <section className="my-8 max-w-[80%] lg:max-w-[40%]">
          {SearchBox()}
        </section>

        <section className="mt-8">
          <Table<serviceFormProps>
            rowKey="id"
            columns={columns}
            dataSource={data}
            loading={isLoading || isFetching}
            expandable={{
              expandedRowRender: (row) => (
                <section className="flex flex-col gap-1">
                  {/* <p className="capitalize text-lg font-semibold text-gray-800">
                    {t("WORKERS_DETAILS")}:
                  </p> */}
                  <div className="flex justify-between flex-wrap gap-4">
                    {row?.reservationWorkers &&
                    row?.reservationWorkers?.length !== 0 ? (
                      row?.reservationWorkers?.map((worker) => (
                        <div key={worker.workerId} className="flex gap-2">
                          <span className="w-[3px] h-6 bg-mainOrange rounded-full" />
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-600">
                              {t("WORKER")} :{" "}
                            </span>
                            <span className="text-gray-500">
                              {lang === "ar"
                                ? worker.workerArName
                                : worker.workerName}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="flex items-center gap-2 justify-center w-full text-gray-300 capitalize">
                        <BsBoxSeam size={20} />

                        <span>{t("NO_DATA_FOUND")}</span>
                      </p>
                    )}
                  </div>
                </section>
              ),
            }}
            // onRow={(record) => ({
            //   onClick: () => handleRowClick(record),
            //   style: {
            //     cursor: "pointer",
            //   },
            // })}
          />
        </section>
      </div>

      <HoldReservationModal
        open={isModalOpen}
        close={closeHoldReservationModal}
        loading={
          holdReservationLoading ||
          holdReservationIsFetching ||
          holdAddReservationLoading
        }
        t={t}
        submitFunction={handleHoldReservationSubmit}
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        isDirty={isDirty}
      />
    </main>
  );
};
