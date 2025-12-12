import { BiSortAlt2 } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import Title from "../../components/Common/Title/title";
import { Button, Dropdown, Skeleton, type MenuProps } from "antd";
import EmployeeCard from "./Components/employeeCard";
import CustomPagination from "../../components/Common/Pagination/pagination";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetAllEmployeesQuery } from "../../components/APIs/EmployeesQuery/EMPLOYEES_QUERY";
import { useState } from "react";

const Employees = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    NumberOfItemsPerPage: 15,
  });

  const { data, isLoading, isFetching } = useGetAllEmployeesQuery({
    page: pagination.CurrentPage,
    size: pagination.NumberOfItemsPerPage,
  });

  // console.log(data);

  const items: MenuProps["items"] = [
    {
      label: "New to old",
      key: "0",
    },
    {
      label: "Old to new",
      key: "1",
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
    {
      type: "divider",
    },
    {
      label: "Employee",
      key: "3",
    },
  ];

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

        <Dropdown menu={{ items }} trigger={["click"]}>
          <a onClick={(e) => e.preventDefault()}>
            <Button
              shape="circle"
              size="large"
              icon={<BiSortAlt2 className="text-[#343434] size-5 md:size-5" />}
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
    <div className="employees-container h-full flex flex-col justify-start">
      <section className="employees-title-wrapper">
        <Title title={t("EMPLOYEES")} component={handleAddButton} />
      </section>

      <section className="employees-cards-wrapper grow max-h-[70vh] overflow-y-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl-grid-cols-5">
        {isLoading || isFetching
          ? [...Array(10)]?.map((_, index) => (
              <Skeleton key={index} avatar paragraph={{ rows: 2 }} />
            ))
          : data?.data?.map((employee) => (
              <div
                key={employee?.id}
                onClick={() => handleNavigateView(employee?.id)}
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
