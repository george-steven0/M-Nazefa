import { AiOutlineEye } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { Button, Table, type TableProps } from "antd";
import type { clientsPropsType } from "../../components/Utilities/Types/types";
import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSearchBox } from "../../components/Common/Search/searchInput";

const Actions = ({ data }: { data: clientsPropsType }) => {
  const navigate = useNavigate();
  const handleNavigateEdit = () => {
    navigate(`edit-client?id=${data?.id}`);
    console.log(data);
  };
  return (
    <div className="flex items-center gap-2">
      <Button
        shape="circle"
        className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        onClick={handleNavigateEdit}
        icon={<BiEdit size={20} />}
      />
      <Button
        className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        shape="circle"
        icon={<AiOutlineEye size={20} />}
      />
    </div>
  );
};
const Clients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const columns: TableProps<clientsPropsType>["columns"] = [
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
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Joining Date",
      dataIndex: "joinDate",
      key: "joinDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data) => (
        <span
          className={`w-[100px] rounded-xl p-2 block text-center font-semibold ${
            data === "VIP"
              ? "text-[#027A48] bg-[#027A48]/20"
              : data === "Stable"
              ? "text-[#493971] bg-[#493971]/20"
              : data === "Refunded"
              ? "text-[#1D1B1B] bg-[#1D1B1B]/20"
              : ""
          }`}
        >
          {data}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (data) => <Actions data={data} />,
    },
  ];

  const data: clientsPropsType[] = [
    {
      key: "1",
      id: "1",
      name: "John Brown",
      phoneNumber: "+20115778532",
      joinDate: "25-11-2023",
      status: "VIP",
    },
    {
      key: "2",
      id: "2",
      name: "Mike thunder",
      phoneNumber: "+200000532",
      joinDate: "10-11-2025",
      status: "Stable",
    },
    {
      key: "3",
      id: "3",
      name: "John Brown",
      phoneNumber: "+20115778532",
      joinDate: "05-11-2003",
      status: "Refunded",
    },
  ];

  const handleAddButton = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={() => navigate("add-client")}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_CLIENT")}
        </Button>
      </div>
    );
  };

  const { SearchBox } = useSearchBox({
    placeholder: "Search Clients",
  });
  //   console.log(debounceValue);

  //   const handleNavigateView = (index: number) => {
  //     navigate(`view-employee?id=${index}`);
  //   };

  //Render Outlet
  const isChildClientPage =
    pathname.includes("add-client") ||
    pathname.includes("view-client") ||
    pathname.includes("edit-client");

  // 🔹 If yes → render only AddClient content
  if (isChildClientPage) {
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
    <div className="clients-page-wrapper">
      <section className="employees-title-wrapper">
        <Title title={t("CLIENTS")} component={handleAddButton} />
      </section>

      <section className="my-8 max-w-[80%] lg:max-w-[40%]">
        {SearchBox()}
      </section>

      <section className="mt-8">
        <Table<clientsPropsType>
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
    </div>
  );
};

export default Clients;
