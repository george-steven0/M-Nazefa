import { useState } from "react";
import {
  useGetAllToolsQuery,
  useDeleteToolMutation,
} from "../../components/APIs/Tools/TOOLS_QUERY";
import { Button, Popconfirm, Table, type TableProps } from "antd";
import type { toolProps } from "../../components/Utilities/Types/types";
import { useTranslation } from "react-i18next";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import Title from "../../components/Common/Title/title";
import type { TFunction } from "i18next";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { handleApiError } from "../../components/Utilities/helper";
import ToolForm from "./Components/toolForm";

const Actions = ({ data, t }: { data: toolProps; t: TFunction }) => {
  const [editModal, setEditModal] = useState(false);
  const [deleteTool, { isLoading: isDeleteLoading }] =
    useDeleteToolMutation();

  const handleEditModalToggle = () => {
    setEditModal((prev) => !prev);
  };

  const handleDeleteTool = async () => {
    try {
      await deleteTool({ id: data.id! }).unwrap();
      toast.success(t("TOOL_DELETED_SUCCESS"));
    } catch (error) {
      handleApiError(error, t("TOOL_DELETE_FAILED"));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleEditModalToggle}
        shape="circle"
        className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        icon={<BiEdit size={20} />}
      />

      <Popconfirm
        title={t("DELETE_TOOL")}
        description={t("DELETE_TOOL_CONFIRM")}
        okText={t("DELETE")}
        cancelText={t("CANCEL")}
        okButtonProps={{ danger: true, loading: isDeleteLoading }}
        onConfirm={handleDeleteTool}
      >
        <Button
          shape="circle"
          className="hover:bg-mainRed hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
          icon={<AiOutlineDelete size={20} />}
        />
      </Popconfirm>

      <ToolForm
        open={editModal}
        close={handleEditModalToggle}
        t={t}
        data={data}
        type="edit"
      />
    </div>
  );
};

export default function Tools() {
  const { t } = useTranslation();
  const { data: tools, isLoading, isFetching } = useGetAllToolsQuery();

  const [openAddModal, setOpenAddModal] = useState(false);

  const handleAddModalToggle = () => {
    setOpenAddModal((prev) => !prev);
  };

  const columns: TableProps<toolProps>["columns"] = [
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      key: "name",
      title: t("NAME_EN"),
      dataIndex: "name",
      render: (text) => <span>{text || t("NA")}</span>,
    },
    {
      key: "arName",
      title: t("NAME_AR"),
      dataIndex: "arName",
      render: (text) => <span>{text || t("NA")}</span>,
    },
    {
      key: "type",
      title: t("TYPE"),
      dataIndex: "type",
      render: (text) => <span>{text ? t(text.toUpperCase()) : t("NA")}</span>,
    },
    {
      key: "actions",
      title: t("ACTIONS"),
      render: (data) => <Actions data={data} t={t} />,
    },
  ];

  const data: toolProps[] = tools?.data ? tools?.data : [];

  const handleAddModal = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={handleAddModalToggle}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_TOOL")}
        </Button>
      </div>
    );
  };

  const { SearchBox, debounceValue } = useSearchBox({
    placeholder: t("SEARCH_TOOLS"),
  });

  const searchTerm = debounceValue.trim().toLowerCase();
  const filteredData = searchTerm
    ? data.filter(
        (item) =>
          item?.name?.toLowerCase().includes(searchTerm) ||
          item?.arName?.toLowerCase().includes(searchTerm) ||
          item?.type?.toLowerCase().includes(searchTerm) ||
          String(item?.id ?? "").includes(searchTerm),
      )
    : data;

  return (
    <div className="tools-page-wrapper">
      <section className="employees-title-wrapper">
        <Title title={t("TOOLS")} component={handleAddModal} />
      </section>

      <section className="my-8 max-w-[80%] lg:max-w-[40%]">
        {SearchBox()}
      </section>

      <section className="mt-8">
        <Table<toolProps>
          rowKey={"id"}
          columns={columns}
          dataSource={filteredData}
          loading={isLoading || isFetching}
        />
      </section>

      <ToolForm
        open={openAddModal}
        close={handleAddModalToggle}
        t={t}
        type="add"
      />
    </div>
  );
}
