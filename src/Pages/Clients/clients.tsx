import { AiOutlineEye } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { Button, Table, type TableProps } from "antd";
import type { clientFormPropsType } from "../../components/Utilities/Types/types";
import Title from "../../components/Common/Title/title";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { useGetAllCustomersQuery } from "../../components/APIs/ClientQuery/CLIENTS_QUERY";
import { useTranslation } from "react-i18next";

const Actions = ({ data }: { data: clientFormPropsType }) => {
  const navigate = useNavigate();
  const handleNavigate = (type: string) => {
    navigate(`${type}-client?id=${data?.id}`);
    // console.log(data);
  };
  return (
    <div className="flex items-center gap-2">
      <Button
        shape="circle"
        className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        onClick={() => handleNavigate("edit")}
        icon={<BiEdit size={20} />}
      />
      <Button
        shape="circle"
        className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        onClick={() => handleNavigate("view")}
        icon={<AiOutlineEye size={20} />}
      />
    </div>
  );
};
const Clients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data: customers, isLoading, isFetching } = useGetAllCustomersQuery();

  // console.log(customers?.data);

  const columns: TableProps<clientFormPropsType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("FULL_NAME"),
      dataIndex: "name",
      key: "name",
      render: (_, data) => (
        <span>{data?.firstName + " " + data?.lastName}</span>
      ),
    },
    {
      title: t("PHONE_NUMBER"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("ID_NUMBER"),
      dataIndex: "idNumber",
      key: "idNumber",
    },

    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (data) => (
        <span
          className={`w-[120px] text-xs rounded-full p-2 block text-center font-semibold ${
            data === true
              ? "text-[#027A48] bg-[#027A48]/20"
              : "text-mainRed bg-mainRed/20"
          }`}
        >
          {data ? t("ACTIVE") : t("DEACTIVATED")}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (data) => <Actions data={data} />,
    },
  ];

  const data: clientFormPropsType[] = customers?.data ? customers?.data : [];

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
        <Table<clientFormPropsType>
          id="clients-table"
          rowKey={(record) => record?.id || ""}
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
  );
};

export default Clients;
