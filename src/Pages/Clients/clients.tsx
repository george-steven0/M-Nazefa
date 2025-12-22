import { AiOutlineEye } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import {
  Button,
  Dropdown,
  type MenuProps,
  type TablePaginationConfig,
  type TableProps,
} from "antd";
import type { clientFormPropsType } from "../../components/Utilities/Types/types";
import Title from "../../components/Common/Title/title";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { useGetAllCustomersQuery } from "../../components/APIs/ClientQuery/CLIENTS_QUERY";
import { useTranslation } from "react-i18next";
import useCustomDataTable from "../../components/Common/Datatable/dataTable";
import { useState } from "react";
import { MdFilterAlt } from "react-icons/md";

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
  const [sort, setSort] = useState("true");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { SearchBox, debounceValue } = useSearchBox({
    placeholder: "Search Clients",
  });
  const {
    data: customers,
    isLoading,
    isFetching,
  } = useGetAllCustomersQuery({
    page: pagination.current,
    size: pagination.pageSize,
    search: debounceValue,
    DescendingOrder: sort,
  });

  // console.log(customers);

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

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    // console.log(pagination);

    setPagination({
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? 10,
    });
  };

  const { renderDataTable } = useCustomDataTable({
    cols: columns,
    data: data ?? [],
    isLoading: isLoading || isFetching,
    total: customers?.paginationHeader?.totalItems ?? 0,
    pagination,
    onChange: handleTableChange,
  });

  const items: MenuProps["items"] = [
    {
      label: t("NEW_TO_OLD"),
      key: "true",
    },
    {
      label: t("OLD_TO_NEW"),
      key: "false",
    },
  ];
  const handleMenuClick: MenuProps["onClick"] = (info) => {
    // console.log("Clicked item key:", info.key);
    // You can map key to a value or use it directly
    if (info.key === "true") {
      setSort("true");
    } else if (info.key === "false") {
      setSort("false");
    }
  };

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

      <section className="my-8 flex items-center justify-between">
        <div className="w-fit md:min-w-[400px]">{SearchBox()}</div>

        <div>
          <Dropdown
            menu={{ items, onClick: handleMenuClick, selectedKeys: [sort] }}
            trigger={["click"]}
            popupRender={(menu) => (
              <div className="bg-white rounded-xl shadow-md p-2 min-w-[220px]">
                {menu}
              </div>
            )}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Button
                shape="circle"
                size="large"
                icon={
                  <MdFilterAlt className="text-[#343434] size-5 md:size-5" />
                }
              />
            </a>
          </Dropdown>
        </div>
      </section>

      <section className="mt-8 overflow-x-auto">
        {/* <Table<clientFormPropsType>
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
        /> */}
        {renderDataTable()}
      </section>
    </div>
  );
};

export default Clients;
