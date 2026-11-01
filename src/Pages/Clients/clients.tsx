import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { BiEdit, BiWallet } from "react-icons/bi";
import { RiUserAddLine, RiLockPasswordLine } from "react-icons/ri";
import {
  Button,
  Dropdown,
  Modal,
  Popconfirm,
  type MenuProps,
  type TablePaginationConfig,
  type TableProps,
} from "antd";
import type {
  APIErrorProps,
  clientFormPropsType,
  customerAccountPropsType,
} from "../../components/Utilities/Types/types";
import Title from "../../components/Common/Title/title";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import {
  useGetAllCustomersQuery,
  useDeleteCustomerMutation,
  useGenerateCustomerAccountMutation,
  useResetCustomerAccountPasswordMutation,
} from "../../components/APIs/ClientQuery/CLIENTS_QUERY";
import { useTranslation } from "react-i18next";
import useCustomDataTable from "../../components/Common/Datatable/dataTable";
import { useState } from "react";
import { MdFilterAlt } from "react-icons/md";
import { fullDateFormat } from "../../components/Utilities/helper";
import { toast } from "react-toastify";
import {
  hasPermission,
  isAdmin,
  isSuperAdmin,
} from "../../Utilities/utilities";
import { PERMISSIONS } from "../../Utilities/permissions.config";

const AccountCredentialsModal = ({
  credentials,
  onClose,
}: {
  credentials: customerAccountPropsType | null;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={!!credentials}
      title={t("ACCOUNT_CREDENTIALS")}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          {t("CLOSE")}
        </Button>,
      ]}
    >
      <p className="text-mainRed text-sm mb-4">
        {t("ACCOUNT_CREDENTIALS_NOTE")}
      </p>
      <div className="flex flex-col gap-2">
        <div>
          <span className="font-semibold">{t("USERNAME")}: </span>
          <span>{credentials?.userName}</span>
        </div>
        <div>
          <span className="font-semibold">{t("PASSWORD")}: </span>
          <span>{credentials?.password}</span>
        </div>
      </div>
    </Modal>
  );
};

const Actions = ({
  data,
  onCredentials,
}: {
  data: clientFormPropsType;
  onCredentials: (credentials: customerAccountPropsType) => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (type: string) => {
    navigate(`${type}-client?id=${data?.id}`);
    // console.log(data);
  };

  const [deleteCustomer, { isLoading: isDeleteLoading }] =
    useDeleteCustomerMutation();
  const [generateAccount, { isLoading: isGenerateLoading }] =
    useGenerateCustomerAccountMutation();
  const [resetAccountPassword, { isLoading: isResetLoading }] =
    useResetCustomerAccountPasswordMutation();

  const canManage = isAdmin() || isSuperAdmin();

  const handleDelete = async () => {
    try {
      await deleteCustomer({ id: data?.id ?? "" }).unwrap();
      toast.success(t("CUSTOMER_DELETED_SUCCESS"));
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages?.length) {
        err.data.errorMessages.forEach((message) => toast.error(message));
      } else {
        toast.error(t("CUSTOMER_DELETE_FAILED"));
      }
    }
  };

  const handleGenerateAccount = async () => {
    try {
      const res = await generateAccount({
        customerId: data?.id ?? "",
      }).unwrap();
      toast.success(t("GENERATE_ACCOUNT_SUCCESS"));
      if (res?.data) onCredentials(res.data);
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages?.length) {
        err.data.errorMessages.forEach((message) => toast.error(message));
      } else {
        toast.error(t("GENERATE_ACCOUNT_FAILED"));
      }
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await resetAccountPassword({
        customerId: data?.id ?? "",
      }).unwrap();
      toast.success(t("RESET_PASSWORD_SUCCESS"));
      if (res?.data) onCredentials(res.data);
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages?.length) {
        err.data.errorMessages.forEach((message) => toast.error(message));
      } else {
        toast.error(t("RESET_PASSWORD_FAILED"));
      }
    }
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
      {canManage && !data?.hasAccount && (
        <Popconfirm
          title={t("GENERATE_ACCOUNT")}
          description={t("GENERATE_ACCOUNT_CONFIRM")}
          okText={t("GENERATE_ACCOUNT")}
          cancelText={t("CANCEL")}
          okButtonProps={{ loading: isGenerateLoading }}
          onConfirm={handleGenerateAccount}
        >
          <Button
            shape="circle"
            title={t("GENERATE_ACCOUNT")}
            className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
            icon={<RiUserAddLine size={20} />}
          />
        </Popconfirm>
      )}
      {canManage && data?.hasAccount && (
        <Popconfirm
          title={t("RESET_PASSWORD")}
          description={t("RESET_PASSWORD_CONFIRM")}
          okText={t("RESET_PASSWORD")}
          cancelText={t("CANCEL")}
          okButtonProps={{ loading: isResetLoading }}
          onConfirm={handleResetPassword}
        >
          <Button
            shape="circle"
            title={t("RESET_PASSWORD")}
            className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
            icon={<RiLockPasswordLine size={20} />}
          />
        </Popconfirm>
      )}
      {hasPermission(PERMISSIONS.VIEW_CUSTOMER_WALLET) && (
        <Button
          shape="circle"
          title={t("CUSTOMER_WALLET")}
          className="hover:bg-mainOrange/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
          onClick={() => navigate(`wallet?id=${data?.id}`)}
          icon={<BiWallet size={20} />}
        />
      )}
      {canManage && (
        <Popconfirm
          title={t("DELETE_CUSTOMER")}
          description={t("DELETE_CUSTOMER_CONFIRM")}
          okText={t("DELETE")}
          cancelText={t("CANCEL")}
          okButtonProps={{ danger: true, loading: isDeleteLoading }}
          onConfirm={handleDelete}
        >
          <Button
            danger
            shape="circle"
            className="size-10 [&>span]:flex [&>span]:items-center"
            icon={<AiOutlineDelete size={20} />}
          />
        </Popconfirm>
      )}
    </div>
  );
};
const Clients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sort, setSort] = useState("true");
  const [credentials, setCredentials] =
    useState<customerAccountPropsType | null>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { SearchBox, debounceValue } = useSearchBox({
    placeholder: t("SEARCH_CLIENTS"),
  });
  const {
    data: customers,
    isLoading,
    isFetching,
  } = useGetAllCustomersQuery({
    page: pagination.current,
    size: pagination.pageSize,
    search: encodeURIComponent(debounceValue),
    DescendingOrder: sort,
  });

  // console.log(customers);

  const columns: TableProps<clientFormPropsType>["columns"] = [
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("FULL_NAME"),
      dataIndex: "name",
      key: "name",
      render: (_, data) => (
        <span>{data?.firstName + " " + data?.middleName + " "+ data?.lastName}</span>
      ),
    },
    {
      title: t("PHONE_NUMBER"),
      dataIndex: "phoneNumbers",
      render: (_, data) => (
        <p>
          {data?.phoneNumbers && data?.phoneNumbers.length > 0
            ? data?.phoneNumbers[0]?.phoneNumber
            : t("N/A")}
        </p>
      ),
      key: "phoneNumber",
    },
    {
      title: t("ID_NUMBER"),
      dataIndex: "idNumber",
      render: (text) => <span>{text || t('NA')}</span>,
      key: "idNumber",
    },

    {
      title: t("NO_OF_RESERVATION"),
      dataIndex: "noOfReservations",
      render: (text) => <span>{text || 0}</span>,
      key: "noOfReservations",
    },

    {
      title: t("LAST_RESERVATION_DATE"),
      dataIndex: "lastReservationDate",
      render: (text) => <span>{fullDateFormat(text) || t('NA')}</span>,
      key: "lastReservationDate",
    },

    {
      title: t("STATUS"),
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
      title: t("HAS_ACCOUNT"),
      dataIndex: "hasAccount",
      key: "hasAccount",
      render: (_, data) => (
        <span
          className={`w-[120px] text-xs rounded-full p-2 block text-center font-semibold ${
            data?.hasAccount
              ? "text-[#027A48] bg-[#027A48]/20"
              : "text-mainGray bg-mainGray/20"
          }`}
        >
          {data?.hasAccount ? t("HAS_ACCOUNT") : t("NO_ACCOUNT")}
        </span>
      ),
    },
    {
      key: "actions",
      title: t("ACTIONS"),
      render: (data) => (
        <Actions data={data} onCredentials={setCredentials} />
      ),
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
    pathname.includes("edit-client") ||
    pathname.includes("/clients/wallet");

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

      <AccountCredentialsModal
        credentials={credentials}
        onClose={() => setCredentials(null)}
      />
    </div>
  );
};

export default Clients;
