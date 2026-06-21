import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import {
  Button,
  DatePicker,
  Popconfirm,
  Table,
  type TableProps,
} from "antd";
import type {
  APIErrorProps,
  workerManagementFormProps,
  workerManagementResponseProps,
} from "../../components/Utilities/Types/types";
import {
  useAddDurationMutation,
  useDeleteWorkerManagementByListIdMutation,
  useGetDurationBetweenDatesQuery,
} from "../../components/APIs/WorkerManagement/WORKER_MANAGEMENT_QUERY";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import dayjs, { type Dayjs } from "dayjs";
import { fullDateFormat } from "../../components/Utilities/helper";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import WorkerManagementForm from "./Components/workerManagementForm";
import EditWorkerManagementForm from "./Components/editWorkerManagementForm";

const { RangePicker } = DatePicker;

const WorkerManagement = () => {
  const { t } = useTranslation();

  // ── State ──────────────────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] =
    useState<workerManagementResponseProps | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("day"),
    dayjs().endOf("day"),
  ]);

  const openAddModal = ({ type }: { type?: string }) => {
    if (type === "view") {
      setIsAddModalOpen(true);
      return;
    } else {
      reset({ startDate: "", endDate: "", workersNo: 0, notes: "" });
      setIsAddModalOpen(true);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    reset();
  };

  const openEditModal = (record: workerManagementResponseProps) => {
    setRecordToEdit(record);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setRecordToEdit(null);
  };

  // ── Queries ────────────────────────────────────────────────────────────────
  const {
    data: durations,
    isLoading,
    isFetching,
  } = useGetDurationBetweenDatesQuery({
    from: dateRange[0].startOf("day").toISOString(),
    to: dateRange[1].endOf("day").toISOString(),
  });

  // ── Delete ─────────────────────────────────────────────────────────────────
  const [deleteWorkerManagement, { isLoading: isDeleteLoading }] =
    useDeleteWorkerManagementByListIdMutation();

  const handleDeleteSelected = async () => {
    try {
      await deleteWorkerManagement(selectedRowKeys as (string | number)[]).unwrap();
      toast.success(t("WORKER_MANAGEMENT_DELETED_SUCCESS"));
      setSelectedRowKeys([]);
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0].startOf("day"), dates[1].endOf("day")]);
    }
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: TableProps<workerManagementResponseProps>["columns"] = [
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: t("AVAILABLE_WORKERS"),
      dataIndex: "availableNoWorkers",
      key: "availableNoWorkers",
      render: (text) => <p>{text || 0}</p>,
    },
    {
      title: t("REMAIN_WORKERS"),
      dataIndex: "remainNoOfWorkers",
      key: "remainNoOfWorkers",
      render: (text) => <p>{text || 0}</p>,
    },
    {
      title: t("DATE"),
      dataIndex: "date",
      key: "date",
      render: (text) => <span>{fullDateFormat(text) || t("NA")}</span>,
    },
    {
      title: t("NOTES"),
      dataIndex: "notes",
      key: "notes",
      render: (text) => <p>{text || t("NA")}</p>,
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      render: (_, record) => (
        <Button
          shape="circle"
          className="hover:bg-mainColor/60 hover:text-white hover:border-transparent size-10 [&>span]:flex [&>span]:items-center"
          onClick={() => openEditModal(record)}
          icon={<BiEdit size={20} />}
        />
      ),
    },
  ];

  const data: workerManagementResponseProps[] = durations?.data || [];

  // ── Title component ────────────────────────────────────────────────────────
  const handleTitleComponent = () => {
    return (
      <div className="flex gap-2 items-center [&>button]:py-5 [&>button]:capitalize">
        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title={t("DELETE_SELECTED")}
            description={t("DELETE_CONFIRM_MESSAGE")}
            okText={t("DELETE")}
            cancelText={t("CANCEL")}
            okButtonProps={{ danger: true, loading: isDeleteLoading }}
            onConfirm={handleDeleteSelected}
          >
            <Button danger icon={<AiOutlineDelete size={16} />}>
              {t("DELETE_SELECTED")} ({selectedRowKeys.length})
            </Button>
          </Popconfirm>
        )}
        <Button onClick={openAddModal} className="text-white bg-mainColor">
          {t("ADD_DURATION")}
        </Button>
      </div>
    );
  };

  // ___________ add duration modal
  // ── Mutations ──────────────────────────────────────────────────────────────
  const [addDuration, { isLoading: isAddDurationLoading }] =
    useAddDurationMutation();

  // ── Form ───────────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<workerManagementFormProps>({
    defaultValues: {
      startDate: "",
      endDate: "",
      workersNo: 0,
      notes: "",
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAddDuration = async (data: workerManagementFormProps) => {
    try {
      await addDuration(data).unwrap();
      toast.success(t("DURATION_ADDED_SUCCESS"));
      closeAddModal();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  };
  // ___________ add duration modal

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <main>
      <header>
        <Title
          title={t("WORKER_MANAGEMENT")}
          component={handleTitleComponent()}
        />
      </header>

      <div>
        {/* ── Date Range Filter ──────────────────────────────────────────── */}
        <section className="my-8 flex items-center gap-4">
          <label className="font-semibold text-sm text-mainColor capitalize">
            {t("FILTER_BY_DATE")}:
          </label>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD-MM-YYYY"
            className="min-h-10"
            allowClear={false}
          />
        </section>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <section className="mt-8">
          <Table<workerManagementResponseProps>
            rowKey="id"
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            columns={columns}
            dataSource={data}
            loading={isLoading || isFetching}
          />
        </section>
      </div>

      {/* ── Add Duration Modal ────────────────────────────────────────────── */}
      <WorkerManagementForm
        isAddModalOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        handleSubmit={handleSubmit}
        handleAddDuration={handleAddDuration}
        control={control}
        errors={errors}
        t={t}
        isAddDurationLoading={isAddDurationLoading}
      />

      {/* ── Edit Worker Management Modal ──────────────────────────────────── */}
      <EditWorkerManagementForm
        open={isEditModalOpen}
        close={closeEditModal}
        record={recordToEdit}
      />
    </main>
  );
};

export default WorkerManagement;

// const TableActionCOmponent = ({ open, close, data,t }) => {
//   console.log(data);

//   return (
//     <div>
//       <Button
//         onClick={() => open({ type: "view" })}
//         className="bg-gray-200 hover:bg-gray-50 text-mainColor border-gray-300"
//       >
//         <FaEye size={18} />
//       </Button>

//       <WorkerManagementForm
//         isAddModalOpen={open}
//         closeAddModal={close}
//         t={t}
//         isAddDurationLoading={isAddDurationLoading}
//       />
//     </div>
//   );
// };
