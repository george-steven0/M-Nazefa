import { useState } from "react";
import { Button, Table, type TableProps } from "antd";
import type { seedersProps } from "../../components/Utilities/Types/types";
import { useTranslation } from "react-i18next";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import Title from "../../components/Common/Title/title";
import type { TFunction } from "i18next";
import { BiEdit } from "react-icons/bi";
import { useGetCleaningAreasQuery } from "../../components/APIs/CleaningArea/CLEANING_AREA_QUERY";
import CleaningAreaForm from "./Components/cleaningAreaForm";

const Actions = ({ data, t }: { data: seedersProps; t: TFunction }) => {
  const [editModal, setEditModal] = useState(false);

  const handleEditModalToggle = () => {
    setEditModal((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleEditModalToggle}
        shape="circle"
        className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        icon={<BiEdit size={20} />}
      />

      <CleaningAreaForm
        open={editModal}
        close={handleEditModalToggle}
        t={t}
        data={data}
      />
    </div>
  );
};

export default function CLeaningArea() {
  const { t } = useTranslation();
  const {
    data: cleaningAreas,
    isLoading,
    isFetching,
  } = useGetCleaningAreasQuery();

  const [openAddModal, setOpenAddModal] = useState(false);

  const handleAddModalToggle = () => {
    setOpenAddModal((prev) => !prev);
  };

  const columns: TableProps<seedersProps>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      key: "name",
      title: t("NAME_EN"),
      dataIndex: "name",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      key: "arName",
      title: t("NAME_AR"),
      dataIndex: "arName",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      key: "actions",
      title: t("ACTIONS"),
      render: (data) => <Actions data={data} t={t} />,
    },
  ];

  const data: seedersProps[] = cleaningAreas?.data ? cleaningAreas?.data : [];

  const handleAddModal = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={handleAddModalToggle}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_CLEANING_AREA")}
        </Button>
      </div>
    );
  };

  const { SearchBox } = useSearchBox({
    placeholder: "Search cleaning areas",
  });

  return (
    <div className="cleaning-areas-page-wrapper">
      <section className="title-wrapper">
        <Title title={t("CLEANING_AREA")} component={handleAddModal} />
      </section>

      <section className="my-8 max-w-[80%] lg:max-w-[40%]">
        {SearchBox()}
      </section>

      <section className="mt-8">
        <Table<seedersProps>
          rowKey={"id"}
          columns={columns}
          dataSource={data || []}
          loading={isLoading || isFetching}
          // onRow={(record) => ({
          //   onClick: () => handleRowClick(record),
          //   style: {
          //     cursor: "pointer",
          //   },
          // })}
        />
      </section>

      <CleaningAreaForm
        open={openAddModal}
        close={handleAddModalToggle}
        t={t}
        type="add"
      />
    </div>
  );
}
