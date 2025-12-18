import { BiEdit } from "react-icons/bi";
import { Button, Table, type TableProps } from "antd";
import type { rolesFormProps } from "../../components/Utilities/Types/types";
import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { useGetAllRolesQuery } from "../../components/APIs/Roles/ROLE_QUERY";
import AddRole from "./Components/addRole";
import { useState } from "react";
import EditRole from "./Components/editRole";
import type { TFunction } from "i18next";

const Actions = ({ data, t }: { data: rolesFormProps; t: TFunction }) => {
  const [editAddRole, seteditAddRole] = useState(false);

  const handleEditRoleToggle = () => {
    seteditAddRole((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleEditRoleToggle}
        shape="circle"
        className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        // onClick={handleNavigateEdit}
        icon={<BiEdit size={20} />}
      />

      <EditRole
        open={editAddRole}
        close={handleEditRoleToggle}
        t={t}
        data={data}
      />
    </div>
  );
};
const Roles = () => {
  const { t } = useTranslation();

  const { data: roles, isLoading, isFetching } = useGetAllRolesQuery(null);

  const [openAddRole, setOpenAddRole] = useState(false);

  const handleAddRoleToggle = () => {
    setOpenAddRole((prev) => !prev);
  };

  const columns: TableProps<rolesFormProps>["columns"] = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text) => <p>{text}</p>,
    // },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "actions",
      title: "Actions",
      render: (data) => <Actions data={data} t={t} />,
    },
  ];

  const data: rolesFormProps[] = roles?.data ? roles?.data : [];

  const handleAddButton = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={handleAddRoleToggle}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_ROLE")}
        </Button>
      </div>
    );
  };

  const { SearchBox } = useSearchBox({
    placeholder: "Search Roles",
  });

  return (
    <div className="Roles-page-wrapper">
      <section className="employees-title-wrapper">
        <Title title={t("ROLES")} component={handleAddButton} />
      </section>

      <section className="my-8 max-w-[80%] lg:max-w-[40%]">
        {SearchBox()}
      </section>

      <section className="mt-8">
        <Table<rolesFormProps>
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

      <AddRole open={openAddRole} close={handleAddRoleToggle} t={t} />
    </div>
  );
};

export default Roles;
