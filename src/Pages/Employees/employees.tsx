import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { Button, Divider, Dropdown, Skeleton, type MenuProps } from "antd";
import EmployeeCard from "./Components/employeeCard";
import CustomPagination from "../../components/Common/Pagination/pagination";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetAllEmployeesQuery } from "../../components/APIs/EmployeesQuery/EMPLOYEES_QUERY";
import { useState } from "react";
import { useSearchBox } from "../../components/Common/Search/searchInput";
import { MdFilterAlt } from "react-icons/md";

const Employees = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    NumberOfItemsPerPage: 15,
  });
  const [sort, setSort] = useState("true");

  const { SearchBox, debounceValue } = useSearchBox();

  const { data, isLoading, isFetching } = useGetAllEmployeesQuery({
    page: pagination.CurrentPage,
    size: pagination.NumberOfItemsPerPage,
    DescendingOrder: sort,
    search: debounceValue,
  });

  // console.log(data);

  const items: MenuProps["items"] = [
    {
      label: t("NEW_TO_OLD"),
      key: "true",
    },
    {
      label: t("OLD_TO_NEW"),
      key: "false",
    },
    // {
    //   label: (
    //     <a
    //       href="https://www.aliyun.com"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       2nd menu item
    //     </a>
    //   ),
    //   key: "1",
    // },
  ];

  const handleMenuClick: MenuProps["onClick"] = (info) => {
    // console.log("Clicked item key:", info.key);
    // You can map key to a value or use it directly
    if (info.key === "true") {
      setSort("true");
    } else if (info.key === "false") {
      setSort("false");
    }
  };

  const isChildEmployeePage =
    pathname.includes("add-employee") ||
    pathname.includes("view-employee") ||
    pathname.includes("edit-employee");

  // 🔹 If yes → render only AddEmployee content
  if (isChildEmployeePage) {
    return <Outlet />;
  }

  const handleAddButton = () => {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={() => navigate("add-employee")}
          className="bg-mainColor px-4 text-white py-5 capitalize text-sm"
        >
          {t("ADD_EMPLOYEE")}
        </Button>

        <Dropdown
          menu={{ items, onClick: handleMenuClick, selectedKeys: [sort] }}
          trigger={["click"]}
          popupRender={(menu) => (
            <div className="bg-white rounded-xl shadow-md p-2 min-w-[220px]">
              {/* 🔍 Search box */}
              {SearchBox()}

              <Divider style={{ margin: "8px 0" }} />

              {/* Default menu */}
              {menu}
            </div>
          )}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Button
              shape="circle"
              size="large"
              icon={<MdFilterAlt className="text-[#343434] size-5 md:size-5" />}
            />
          </a>
        </Dropdown>
      </div>
    );
  };

  const handleNavigateView = (id: string | number) => {
    navigate(`view-employee?id=${id}`);
  };
  return (
    <div className="employees-container h-full items-stretch flex flex-col justify-start">
      <section className="employees-title-wrapper">
        <Title title={t("EMPLOYEES")} component={handleAddButton} />
      </section>

      <section className="employees-cards-wrapper grow max-h-[70vh] overflow-y-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl-grid-cols-5 content-start auto-rows-[200px]">
        {isLoading || isFetching
          ? [...Array(pagination?.NumberOfItemsPerPage)]?.map((_, index) => (
              <Skeleton key={index} avatar paragraph={{ rows: 2 }} active />
            ))
          : data?.data?.map((employee) => (
              <div
                key={employee?.id}
                onClick={() => handleNavigateView(employee?.id)}
                // className="h-[200px]"
              >
                <EmployeeCard employee={employee} />
              </div>
            ))}
      </section>

      <section className="mt-10 w-full flex justify-center">
        <CustomPagination
          setPagination={setPagination}
          pagination={pagination}
          total={
            data?.paginationHeader ? data?.paginationHeader?.totalItems : 0
          }
        />
      </section>
    </div>
  );
};

export default Employees;
