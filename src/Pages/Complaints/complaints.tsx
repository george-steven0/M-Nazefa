import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { Button, Table, type TableProps } from "antd";
import type { complaintResponseProps } from "../../components/Utilities/Types/types";
import { useGetAllComplaintsQuery } from "../../components/APIs/Complaints/COMPLAINT_QUERY";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import dayjs from "dayjs";
import { useAppSelector } from "../../components/APIs/store";
import ComplaintForm from "./Components/complaintForm";
import ViewComplaint from "./Components/viewComplaint";

const Complaints = () => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state?.lang);

  // ── State ──────────────────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    null,
  );

  // ── Queries ────────────────────────────────────────────────────────────────
  const {
    data: complaints,
    isLoading,
    isFetching,
  } = useGetAllComplaintsQuery();

  // ── Search ─────────────────────────────────────────────────────────────────
  const { SearchBox } = useSearchBox({
    placeholder: t("SEARCH_COMPLAINTS"),
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openViewModal = (id: string) => {
    setSelectedComplaintId(id);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedComplaintId(null);
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: TableProps<complaintResponseProps>["columns"] = [
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("RESERVATION_ID"),
      dataIndex: "reservationId",
      key: "reservationId",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("COMMENT"),
      dataIndex: "comment",
      key: "comment",
      render: (text) => (
        <p className="max-w-[300px] truncate">{text || t("NA")}</p>
      ),
    },
    {
      title: t("CREATED_BY"),
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text) => <p>{text || t("NA")}</p>,
    },
    {
      title: t("CREATION_DATE"),
      dataIndex: "creationDate",
      key: "creationDate",
      render: (text) => (
        <span>{text ? dayjs(text).format("DD-MM-YYYY hh:mm A") : t("NA")}</span>
      ),
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      render: (row) => (
        <Button
          className="hover:bg-mainGray/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
          shape="circle"
          onClick={() => openViewModal(row?.id?.toString())}
          icon={<AiOutlineEye size={20} />}
        />
      ),
    },
  ];

  const data: complaintResponseProps[] = complaints?.data || [];

  // ── Title component ────────────────────────────────────────────────────────
  const handleTitleComponent = () => {
    return (
      <div className="flex gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
        <Button onClick={openAddModal} className="text-white bg-mainColor ">
          {t("ADD_COMPLAINT")}
        </Button>
      </div>
    );
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <main>
      <header>
        <Title title={t("COMPLAINTS")} component={handleTitleComponent()} />
      </header>

      <div>
        <section className="my-8 max-w-[80%] lg:max-w-[40%]">
          {SearchBox()}
        </section>

        <section className="mt-8">
          <Table<complaintResponseProps>
            rowKey="id"
            columns={columns}
            dataSource={data}
            loading={isLoading || isFetching}
            expandable={{
              expandedRowRender: (row) => (
                <section className="flex flex-col gap-1">
                  <div className="flex justify-between flex-wrap gap-4">
                    {row?.workers && row?.workers?.length !== 0 ? (
                      row?.workers?.map((worker) => (
                        <div key={worker.workerId} className="flex gap-2">
                          <span className="w-[3px] h-6 bg-mainOrange rounded-full" />
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-600">
                              {t("WORKER")} :{" "}
                            </span>
                            <span className="text-gray-500">
                              {lang === "ar"
                                ? worker.workerArName
                                : worker.workerName}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="flex items-center gap-2 justify-center w-full text-gray-300 capitalize">
                        <BsBoxSeam size={20} />
                        <span>{t("NO_DATA_FOUND")}</span>
                      </p>
                    )}
                  </div>
                </section>
              ),
            }}
          />
        </section>
      </div>

      <ComplaintForm open={isAddModalOpen} onClose={closeAddModal} />

      <ViewComplaint
        open={isViewModalOpen}
        onClose={closeViewModal}
        complaintId={selectedComplaintId}
      />
    </main>
  );
};

export default Complaints;
