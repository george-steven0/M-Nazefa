import { BiEdit } from "react-icons/bi";
import { Button, Table, type TableProps } from "antd";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useGetAllTransportationFeesQuery } from "../../components/APIs/Seeders/SEEDERS_RTK_QUERY";
import type { transportationFeesFormProps } from "../../components/Utilities/Types/types";
import Title from "../../components/Common/Title/title";
import { useState } from "react";
import TransportationForm from "./Components/transportatiosForm";
import { useAppSelector } from "../../components/APIs/store";

const Actions = ({
  data,
  t,
}: {
  data: transportationFeesFormProps;
  t: TFunction;
}) => {
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
        // onClick={handleNavigateEdit}
        icon={<BiEdit size={20} />}
      />

      <TransportationForm
        open={editModal}
        close={handleEditModalToggle}
        t={t}
        data={data}
      />
    </div>
  );
};

const TransportationFees = () => {
  const { lang } = useAppSelector((state) => state?.lang);
  const { t } = useTranslation();

  const {
    data: transportations,
    isLoading,
    isFetching,
  } = useGetAllTransportationFeesQuery();

  // console.log(lang);

  const columns: TableProps<transportationFeesFormProps>["columns"] = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text) => <p>{text}</p>,
    // },
    {
      key: "city",
      title: t("CITY"),
      // dataIndex: "cityName",
      render: (text) => (
        <span className="capitalize">
          {lang === "ar" ? text?.cityArName : text?.cityName}
        </span>
      ),
    },
    {
      key: "area",
      title: t("AREA"),
      // dataIndex: "areaName",
      render: (text) => (
        <span className="capitalize">
          {lang === "ar" ? text?.areaArName : text?.areaName}
        </span>
      ),
    },
    {
      key: "fee",
      title: t("TRANSPORTATION_FEES"),
      dataIndex: "fee",
      render: (text) => <span>{text}</span>,
    },
    {
      key: "actions",
      title: t("ACTIONS"),
      render: (data) => <Actions data={data} t={t} />,
    },
  ];

  const data: transportationFeesFormProps[] = transportations?.data
    ? transportations?.data
    : [];

  const [openModal, setOpenModal] = useState(false);

  const handleModalToggle = () => {
    setOpenModal((prev) => !prev);
  };

  const handleAddButton = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={handleModalToggle}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_TRANSPORTATION_FEE")}
        </Button>
      </div>
    );
  };

  return (
    <div className="transportation-page-wrapper">
      <section className="transportation-title-wrapper">
        <Title title={t("TRANSPORTATION_FEES")} component={handleAddButton} />
      </section>

      <section className="mt-8">
        <Table<transportationFeesFormProps>
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

      <TransportationForm open={openModal} close={handleModalToggle} t={t} />
    </div>
  );
};

export default TransportationFees;
