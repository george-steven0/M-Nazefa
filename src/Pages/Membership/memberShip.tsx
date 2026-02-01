import { Button, Table, type TableProps } from "antd";
import type { membershipFormProps } from "../../components/Utilities/Types/types";
import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import type { TFunction } from "i18next";
import { useState } from "react";
import AddMembership from "./Components/addMembership";
import EditMembership from "./Components/editMembership";
import { BiEdit } from "react-icons/bi";
import { useGetAllMembershipsQuery } from "../../components/APIs/Membership/MEMBERSHIP_QUERY";
import { DateOnlyFormat } from "../../components/Utilities/helper";

const Actions = ({ data, t }: { data: membershipFormProps; t: TFunction }) => {
  const [editMembership, setEditMembership] = useState(false);

  const handleEditMembershipToggle = () => {
    setEditMembership((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleEditMembershipToggle}
        shape="circle"
        className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
        // onClick={handleNavigateEdit}
        icon={<BiEdit size={20} />}
      />

      <EditMembership
        open={editMembership}
        close={handleEditMembershipToggle}
        t={t}
        data={data}
      />
    </div>
  );
};
const Memberships = () => {
  const { t } = useTranslation();

  const {
    data: memberships,
    isLoading,
    isFetching,
  } = useGetAllMembershipsQuery({});

  const [openAddModal, setOpenAddModal] = useState(false);

  const handleAddModalToggle = () => {
    setOpenAddModal((prev) => !prev);
  };

  const columns: TableProps<membershipFormProps>["columns"] = [
    {
      key: "name",
      title: t("NAME"),
      dataIndex: "name",
      render: (text) => <span>{text ? text : t("NA")}</span>,
    },
    {
      key: "code",
      title: t("CODE"),
      dataIndex: "code",
      render: (text) => <span>{text ? text : t("NA")}</span>,
    },
    {
      key: "startDate",
      title: t("START_DATE"),
      dataIndex: "startDate",
      render: (text) => <span>{text ? DateOnlyFormat(text) : t("NA")}</span>,
    },
    {
      key: "endDate",
      title: t("END_DATE"),
      dataIndex: "endDate",
      render: (text) => <span>{text ? DateOnlyFormat(text) : t("NA")}</span>,
    },
    {
      key: "noOfVisits",
      title: t("NUMBER_OF_VISITS"),
      dataIndex: "noOfVisits",
      render: (text) => <span className="">{text ? text : t("NA")}</span>,
    },

    {
      key: "actions",
      title: "Actions",
      render: (data) => <Actions data={data} t={t} />,
    },
  ];

  const data: membershipFormProps[] = memberships?.data
    ? memberships?.data
    : [];

  const handleAddButton = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={handleAddModalToggle}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_MEMBERSHIP")}
        </Button>
      </div>
    );
  };

  const { SearchBox } = useSearchBox({
    placeholder: "Search Memberships",
  });

  return (
    <div className="memberships-page-wrapper">
      <section className="employees-title-wrapper">
        <Title title={t("MEMBERSHIPS")} component={handleAddButton} />
      </section>

      <section className="my-8 max-w-[80%] lg:max-w-[40%]">
        {SearchBox()}
      </section>

      <section className="mt-8">
        <Table<membershipFormProps>
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

      <AddMembership open={openAddModal} close={handleAddModalToggle} t={t} />
    </div>
  );
};

export default Memberships;
