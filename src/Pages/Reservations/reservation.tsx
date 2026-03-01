import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Title from "../../components/Common/Title/title";
import { useTranslation } from "react-i18next";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { Button, Table, type TableProps } from "antd";
// import { BiEdit } from "react-icons/bi";
// import { AiOutlineEye } from "react-icons/ai";
import type { serviceFormProps } from "../../components/Utilities/Types/types";
import { useGetAllReservationsQuery } from "../../components/APIs/Reservations/RESERVATION_QUERY";
import dayjs from "dayjs";

// const Actions = ({ data }: { data: serviceFormProps }) => {
//   const navigate = useNavigate();
//   //   const handleNavigateEdit = () => {
//   //     navigate(`edit-reservation?id=${data?.id}`);
//   //     console.log(data);
//   //   };
//   const handleNavigateView = () => {
//     navigate(`reservation-details?id=${data?.id}`);
//     // console.log(data);
//   };
//   return (
//     <div className="flex items-center gap-2">
//       {/* <Button
//         shape="circle"
//         className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
//         onClick={handleNavigateEdit}
//         icon={<BiEdit size={20} />}
//       /> */}
//       <Button
//         className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
//         shape="circle"
//         onClick={handleNavigateView}
//         icon={<AiOutlineEye size={20} />}
//       />
//     </div>
//   );
// };

export const Reservations = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

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
      title: "Reservation Date",
      dataIndex: "reservationDate",
      key: "reservationDate",
      render: (text) => <span>{dayjs(text).format("DD-MM-YYYY hh:mm A")}</span>,
    },
    {
      title: "General Comments",
      dataIndex: "generalComments",
      key: "generalComments",
      render: (text) => <span>{text}</span>,
    },
    // {
    //   title: "Actions",
    //   render: (data) => <Actions data={data} />,
    // },
  ];

  const data: serviceFormProps[] = reservations?.data || [];

  const isChildClientPage =
    pathname.includes("add-reservation") ||
    pathname.includes("edit-reservation") ||
    pathname.includes("reservation-details");

  if (isChildClientPage) {
    return <Outlet />;
  }
  const handleNavigateAdd = () => {
    navigate(`/reservations/add-reservation`);
  };
  const handleTitleComponent = () => {
    return (
      <div className="flex flex-col gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
        <Button
          onClick={handleNavigateAdd}
          className="text-white bg-mainColor "
        >
          {t("ADD_RESERVATION")}
        </Button>
      </div>
    );
  };
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
            columns={columns}
            dataSource={data}
            loading={isLoading || isFetching}
            // onRow={(record) => ({
            //   onClick: () => handleRowClick(record),
            //   style: {
            //     cursor: "pointer",
            //   },
            // })}
          />
        </section>
      </div>
    </main>
  );
};
