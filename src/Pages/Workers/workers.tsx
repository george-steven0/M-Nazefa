// import { AiOutlineEye } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { Button, Table, type TableProps } from "antd";
import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { Outlet, useLocation } from "react-router-dom";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import AddWorker from "./Components/addWorker";
import { useState } from "react";
import EditWorker from "./Components/editWorker";

type workersPropsType = {
  key: string | number;
  id: string;
  name: string;
  gender: string;
  phoneNumber: string;
  joinDate: string;
};
const Actions = ({ data }: { data: workersPropsType }) => {
  // handle edit modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const toggleEditModal = () => setOpenEditModal((prev) => !prev);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          shape="circle"
          className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
          onClick={toggleEditModal}
          icon={<BiEdit size={20} />}
        />
        {/* <Button
        className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        shape="circle"
        icon={<AiOutlineEye size={20} />}
      /> */}
      </div>

      <EditWorker open={openEditModal} close={toggleEditModal} id={data.id} />
    </>
  );
};
const Workers = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  // handle add modal
  const [openAddModal, setOpenAddModal] = useState(false);
  const toggleAddModal = () => setOpenAddModal((prev) => !prev);

  const columns: TableProps<workersPropsType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Joining Date",
      dataIndex: "joinDate",
      key: "joinDate",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (data) => (
    //     <span
    //       className={`w-[100px] rounded-xl p-2 block text-center font-semibold ${
    //         data === "VIP"
    //           ? "text-[#027A48] bg-[#027A48]/20"
    //           : data === "Stable"
    //           ? "text-[#493971] bg-[#493971]/20"
    //           : data === "Refunded"
    //           ? "text-[#1D1B1B] bg-[#1D1B1B]/20"
    //           : ""
    //       }`}
    //     >
    //       {data}
    //     </span>
    //   ),
    // },
    {
      title: "Actions",
      render: (data) => <Actions data={data} />,
    },
  ];

  const data: workersPropsType[] = [
    {
      key: "1",
      id: "1",
      name: "John Brown",
      phoneNumber: "+20115778532",
      joinDate: "25-11-2023",
      gender: "Male",
    },
    {
      key: "2",
      id: "2",
      name: "Mike thunder",
      phoneNumber: "+200000532",
      joinDate: "10-11-2025",
      gender: "Female",
    },
    {
      key: "3",
      id: "3",
      name: "John Brown",
      phoneNumber: "+20115778532",
      joinDate: "05-11-2003",
      gender: "Male",
    },
  ];

  const handleAddButton = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={toggleAddModal}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_WORKER")}
        </Button>
      </div>
    );
  };

  const { SearchBox } = useSearchBox({
    placeholder: "Search workers",
  });

  const isChildPage =
    pathname.includes("add-worker") || pathname.includes("edit-worker");

  if (isChildPage) {
    return <Outlet />;
  }

  // const handleRowClick = (record: clientsPropsType) => {
  //   navigate("add-reservation", {
  //     state: {
  //       id: record?.id,
  //     },
  //   });
  // };

  return (
    <div className="workers-page-wrapper">
      <section className="employees-title-wrapper">
        <Title title={t("WORKERS")} component={handleAddButton} />
      </section>

      <section className="my-8 max-w-[80%] lg:max-w-[40%]">
        {SearchBox()}
      </section>

      <section className="mt-8">
        <Table<workersPropsType>
          columns={columns}
          dataSource={data}
          // onRow={(record) => ({
          //   onClick: () => handleRowClick(record),
          //   style: {
          //     cursor: "pointer",
          //   },
          // })}
        />
      </section>

      <AddWorker open={openAddModal} close={toggleAddModal} />
    </div>
  );
};

export default Workers;
