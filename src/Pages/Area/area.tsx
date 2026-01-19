import { BiEdit } from "react-icons/bi";
import { Button, Table, type TableProps } from "antd";
import type { areaFormProps } from "../../components/Utilities/Types/types";
import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useSearchBox } from "../../components/Common/Search/searchInput";
// import { useGetAllRolesQuery } from "../../components/APIs/Roles/ROLE_QUERY";
import { useState } from "react";
import type { TFunction } from "i18next";
import AddArea from "./Components/addArea";
import EditArea from "./Components/editArea";
import { useGetAllAreasQuery } from "../../components/APIs/Areas/AREAS_RTK_QUERY";

const Actions = ({ data, t }: { data: areaFormProps; t: TFunction }) => {
  const [editArea, seteditArea] = useState(false);

  const handleEditAreaToggle = () => {
    seteditArea((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleEditAreaToggle}
        shape="circle"
        className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        // onClick={handleNavigateEdit}
        icon={<BiEdit size={20} />}
      />

      <EditArea
        open={editArea}
        close={handleEditAreaToggle}
        t={t}
        data={data}
      />
    </div>
  );
};
const Areas = () => {
  const { t } = useTranslation();

  const { data: areas, isLoading, isFetching } = useGetAllAreasQuery();

  //   console.log(areas);

  const [openAddArea, setOpenAddArea] = useState(false);

  const handleAddAreaToggle = () => {
    setOpenAddArea((prev) => !prev);
  };

  const columns: TableProps<areaFormProps>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      key: "cityName",
      title: t("CITY_NAME"),
      dataIndex: "cityName",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "cityNameAr",
      title: t("CITY_AR_NAME"),
      dataIndex: "cityArName",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "name",
      title: t("AREA_NAME"),
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "arName",
      title: t("AREA_AR_NAME"),
      dataIndex: "arName",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "actions",
      title: t("ACTIONS"),
      render: (data) => <Actions data={data} t={t} />,
    },
  ];

  const data: areaFormProps[] = areas?.data ? areas?.data : [];

  const handleAddButton = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={handleAddAreaToggle}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_NEW_AREA")}
        </Button>
      </div>
    );
  };

  const { SearchBox } = useSearchBox({
    placeholder: "Search Areas",
  });

  return (
    <div className="Roles-page-wrapper">
      <section className="employees-title-wrapper">
        <Title title={t("AREA")} component={handleAddButton} />
      </section>

      <section className="my-8 max-w-[80%] lg:max-w-[40%]">
        {SearchBox()}
      </section>

      <section className="mt-8">
        <Table<areaFormProps>
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

      <AddArea open={openAddArea} close={handleAddAreaToggle} t={t} />
    </div>
  );
};

export default Areas;
