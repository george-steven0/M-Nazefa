// import { AiOutlineEye } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  Button,
  Popconfirm,
  type TablePaginationConfig,
  type TableProps,
} from "antd";
import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { Outlet, useLocation } from "react-router-dom";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { useState } from "react";
import type {
  APIErrorProps,
  workersFormProps,
} from "../../components/Utilities/Types/types";
import {
  useGetAllWorkersQuery,
  useDeleteWorkerMutation,
} from "../../components/APIs/Workers/WORKERS_QUERY";
import useCustomDataTable from "../../components/Common/Datatable/dataTable";
import WorkerFormModal from "./Components/workerFormModal";
import { fullDateFormat } from "../../components/Utilities/helper";
import { FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";
import { isAdmin, isSuperAdmin } from "../../Utilities/utilities";

const Actions = ({ data }: { data: workersFormProps }) => {
  const { t } = useTranslation();
  // handle edit modal
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const toggleEditModal = () => setOpenEditModal((prev) => !prev);

  const [deleteWorker, { isLoading: isDeleteLoading }] =
    useDeleteWorkerMutation();

  const canManage = isAdmin() || isSuperAdmin();

  const handleDelete = async () => {
    try {
      await deleteWorker({ id: data?.id ?? "" }).unwrap();
      toast.success(t("WORKER_DELETED_SUCCESS"));
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages?.length) {
        err.data.errorMessages.forEach((message) => toast.error(message));
      } else {
        toast.error(t("WORKER_DELETE_FAILED"));
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          shape="circle"
          className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
          onClick={toggleEditModal}
          icon={<BiEdit size={20} />}
        />
        {canManage && (
          <Popconfirm
            title={t("DELETE_WORKER")}
            description={t("DELETE_WORKER_CONFIRM")}
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
        {/* <Button
        className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        shape="circle"
        icon={<AiOutlineEye size={20} />}
      /> */}
      </div>

      <WorkerFormModal
        open={openEditModal}
        close={toggleEditModal}
        data={data}
      />
    </>
  );
};

const Workers = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  // handle add modal
  const [openAddModal, setOpenAddModal] = useState(false);
  const toggleAddModal = () => setOpenAddModal((prev) => !prev);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { SearchBox, debounceValue } = useSearchBox({
    placeholder: t("SEARCH_WORKERS"),
  });

  const {
    data: workers,
    isLoading,
    isFetching,
  } = useGetAllWorkersQuery({
    page: pagination.current,
    size: pagination.pageSize,
    search: encodeURIComponent(debounceValue),
  });

  const columns: TableProps<workersFormProps>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("NAME_EN"),
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("NAME_AR"),
      dataIndex: "arName",
      key: "arName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: t("GENDER"),
      dataIndex: "isMale",
      key: "isMale",
      render: (text) => <span>{text ? t("MALE") : t("FEMALE")}</span>,
    },
    {
      title: t("PHONE_NUMBER"),
      dataIndex: "phoneNumbers",
      key: "phoneNumbers",
      render: (phones: string[]) => {
        const list = Array.isArray(phones) ? phones : phones ? [phones] : [];

        if (list.length === 0) return <span>{t("NA")}</span>;

        return (
          <div className="flex flex-col gap-1">
            {list.map((phone, index) => (
              <span key={index} className="flex items-center gap-1.5" dir="ltr">
                <FaPhone className="text-mainColor shrink-0 rotate-90" />
                {phone}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: t("JOINING_DATE"),
      dataIndex: "creationDate",
      key: "creationDate",
      render: (text) => <span>{fullDateFormat(text)}</span>,
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

  const data: workersFormProps[] = workers?.data || [];

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
    total: workers?.paginationHeader?.totalItems ?? 0,
    pagination,
    onChange: handleTableChange,
  });

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

      <section className="mt-8">{renderDataTable()}</section>

      <WorkerFormModal open={openAddModal} close={toggleAddModal} />
    </div>
  );
};

export default Workers;
