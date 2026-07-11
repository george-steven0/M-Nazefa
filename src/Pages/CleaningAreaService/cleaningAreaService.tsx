import { useState } from "react";
import {
  Button,
  Popconfirm,
  type TablePaginationConfig,
  type TableProps,
} from "antd";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import Title from "../../components/Common/Title/title";
import useCustomDataTable from "../../components/Common/Datatable/dataTable";
import type { cleaningAreaServiceProps } from "../../components/Utilities/Types/types";
import {
  useGetAllCleaningAreaServicesQuery,
  useDeleteCleaningAreaServiceMutation,
} from "../../components/APIs/CleaningAreaService/CLEANING_AREA_SERVICE_QUERY";
import { handleApiError } from "../../components/Utilities/helper";
import { isAdmin, isSuperAdmin } from "../../Utilities/utilities";
import CleaningAreaServiceForm from "./Components/cleaningAreaServiceForm";

const Actions = ({
  data,
  t,
}: {
  data: cleaningAreaServiceProps;
  t: TFunction;
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const toggleEditModal = () => setOpenEditModal((prev) => !prev);

  const [deleteCleaningAreaService, { isLoading: isDeleteLoading }] =
    useDeleteCleaningAreaServiceMutation();

  const canManage = isAdmin() || isSuperAdmin();

  const handleDelete = async () => {
    try {
      await deleteCleaningAreaService({ id: data?.id ?? "" }).unwrap();
      toast.success(t("CLEANING_AREA_SERVICE_DELETED_SUCCESS"));
    } catch (error) {
      handleApiError(error, t("CLEANING_AREA_SERVICE_DELETE_FAILED"));
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
            title={t("DELETE_CLEANING_AREA_SERVICE")}
            description={t("DELETE_CLEANING_AREA_SERVICE_CONFIRM")}
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

      <CleaningAreaServiceForm
        open={openEditModal}
        close={toggleEditModal}
        t={t}
        data={data}
        type="edit"
      />
    </>
  );
};

const CleaningAreaService = () => {
  const { t } = useTranslation();

  const [openAddModal, setOpenAddModal] = useState(false);
  const toggleAddModal = () => setOpenAddModal((prev) => !prev);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const {
    data: services,
    isLoading,
    isFetching,
  } = useGetAllCleaningAreaServicesQuery({
    page: pagination.current,
    size: pagination.pageSize,
  });

  const columns: TableProps<cleaningAreaServiceProps>["columns"] = [
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("NAME_EN"),
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text || t("NA")}</span>,
    },
    {
      title: t("NAME_AR"),
      dataIndex: "arName",
      key: "arName",
      render: (text) => <span>{text || t("NA")}</span>,
    },
    {
      title: t("STATUS"),
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <span
          className={`w-[100px] text-xs rounded-full p-2 block text-center font-semibold ${
            active
              ? "text-[#027A48] bg-[#027A48]/20"
              : "text-mainRed bg-mainRed/20"
          }`}
        >
          {active ? t("ACTIVE") : t("INACTIVE")}
        </span>
      ),
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      render: (data) => <Actions data={data} t={t} />,
    },
  ];

  const data: cleaningAreaServiceProps[] = services?.data ?? [];

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? 10,
    });
  };

  const { renderDataTable } = useCustomDataTable({
    cols: columns,
    data: data ?? [],
    isLoading: isLoading || isFetching,
    total: services?.paginationHeader?.totalItems ?? 0,
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
          {t("ADD_CLEANING_AREA_SERVICE")}
        </Button>
      </div>
    );
  };

  return (
    <div className="cleaning-area-service-page-wrapper">
      <section className="title-wrapper">
        <Title title={t("CLEANING_AREA_SERVICES")} component={handleAddButton} />
      </section>

      <section className="mt-8">{renderDataTable()}</section>

      <CleaningAreaServiceForm
        open={openAddModal}
        close={toggleAddModal}
        t={t}
        type="add"
      />
    </div>
  );
};

export default CleaningAreaService;
