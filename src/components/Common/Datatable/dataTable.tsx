import { ConfigProvider, Table, type TablePaginationConfig } from "antd";
import type {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";

export interface DataTableProps<T> {
  cols: ColumnsType<T>;
  data: T[];
  isLoading?: boolean;
  total: number;
  pagination: TablePaginationConfig;
  h?: number | string;
  visibleColumns?: string[];
  onChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
    // extra: TableCurrentDataSource<T>
  ) => void;
}

const useCustomDataTable = <T extends object>({
  cols,
  data,
  isLoading,
  total,
  pagination,
  h,
  visibleColumns,
  onChange,
}: DataTableProps<T>) => {
  // const [pagination, setPagination] = useState<TablePaginationConfig>({
  //   current: 1,
  //   pageSize: 5,
  //   total: total,
  // });

  // const [sorter, setSorter] = useState<{
  //   field?: string;
  //   order?: "ASC" | "DESC";
  // }>({});
  // const [filters, setFilters] = useState<Record<string, string[]>>({});

  // const handleTableChange = (
  //   newPagination: TablePaginationConfig,
  //   newFilters: Record<string, FilterValue | null>,
  //   newSorter: SorterResult<T> | SorterResult<T>[]
  // ) => {
  //   setPagination(newPagination);
  //   setFilters(newFilters as Record<string, string[]>);
  //   if (!Array.isArray(newSorter)) {
  //     setSorter({
  //       field: newSorter.field as string,
  //       order:
  //         newSorter.order === "ascend"
  //           ? "ASC"
  //           : newSorter.order === "descend"
  //           ? "DESC"
  //           : undefined,
  //     });
  //   }
  //   // // Handle Filters
  //   // const formattedFilters: Record<string, string[]> = {};
  //   // Object.entries(newFilters).forEach(([key, value]) => {
  //   //   if (Array.isArray(value)) formattedFilters[key] = value as string[];
  //   // });
  // };

  //   console.log("pagination", pagination);
  //   console.log("sorter", sorter);
  //   console.log("filters", filters);

  const renderDataTable = () => {
    return (
      <div className="overflow-x-auto max-w-[95vw] md:max-w-[90vw] h-full bg-white">
        {" "}
        <ConfigProvider>
          <style>
            {`
          .ant-table-thead > tr > th {
            text-transform: capitalize;
          }
        `}
          </style>
          <Table<T>
            rowKey={(record) =>
              (record as unknown as { id: string }).id ?? JSON.stringify(record)
            }
            columns={
              visibleColumns
                ? cols?.filter(
                    (col) =>
                      typeof col.key === "string" &&
                      visibleColumns?.includes(col?.key?.toString())
                  )
                : cols
            }
            dataSource={data}
            onChange={onChange}
            loading={isLoading}
            scroll={{ y: h ? h : "60vh", x: "max-content" }}
            className="w-full"
            pagination={{
              ...pagination,
              total,
              // pageSize: 5,
              // style: {
              //   backgroundColor: "white",
              // },
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
            sortDirections={["ascend", "descend"]}
          />
        </ConfigProvider>
      </div>
    );
  };

  return { renderDataTable };
};

export default useCustomDataTable;
