import { BsArrowRight } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import { Pagination, type PaginationProps } from "antd";

const CustomPagination = () => {
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return (
        <a className="flex items-center gap-2 text-[#4C4C4C]">
          <BsArrowLeft />
          Previous
        </a>
      );
    }
    if (type === "next") {
      return (
        <a className="flex items-center gap-2 text-[#4C4C4C]">
          Next
          <BsArrowRight />
        </a>
      );
    }
    return originalElement;
  };
  return (
    <>
      <Pagination
        total={500}
        itemRender={itemRender}
        responsive
        showSizeChanger={false}
        className="gap-2 xl:gap-6 [&>.ant-pagination-item-active]:bg-[#F5F4F4] [&>.ant-pagination-item-active>a]:text-black [&>.ant-pagination-item]:text-[#4C4C4C] [&>.ant-pagination-item]:border-none [&>.ant-pagination-item]:"
      />
    </>
  );
};

export default CustomPagination;
