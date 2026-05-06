import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../../components/APIs/store";
import type { TFunction } from "i18next";
import { Skeleton } from "antd";
import type { mostRecentCustomersProps } from "../../../../components/Utilities/Types/types";

type mostRecentCustomerProps = {
  t: TFunction;
  data?: mostRecentCustomersProps[];
  isLoading: boolean;
};
const RecentCustomers = ({ t, data, isLoading }: mostRecentCustomerProps) => {
  const { lang } = useAppSelector((state) => state.lang);
  // console.log(lang);

  return (
    <div className="block-container h-full flex flex-col justify-between">
      <section className="block-title mb-4">
        <p className="text-lg font-bold text-mainTextDark capitalize ">
          {t("RECEN_CUSTOMERS")}
        </p>
      </section>

      <section className="recent-customers-list-wrapper">
        <ul className="flex flex-col gap-5">
          {isLoading ? (
            <div className="flex flex-col gap-1 w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  avatar
                  active
                  paragraph={{ rows: 0 }}
                  className="w-full [&_.ant-skeleton-title]:w-full"
                  style={{ width: "100%" }}
                />
              ))}
            </div>
          ) : (
            data?.map((customer) => (
              <li key={customer?.id} className="flex items-center gap-2">
                <div className="customer-img">
                  <RxAvatar size={35} />
                </div>

                <div className="flex flex-col gap-1 justify-between">
                  <p className="text-sm font-bold text-mainTextDark capitalize">
                    {lang === "en" ? customer?.name : customer?.arName}
                  </p>
                  {/* <p className="text-sm font-normal text-mainTextLight">
                  {customer?.email}
                </p> */}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-4 capitalize text-[#151518] text-sm">
        {isLoading ? (
          <Skeleton
            active
            paragraph={{ rows: 0 }}
            className="w-full [&_.ant-skeleton-title]:w-full"
            style={{ width: "100%" }}
          />
        ) : (
          <Link to="/clients" className="flex items-center gap-1">
            <span>{t("SEE_ALL_CUSTOMERS")}</span>
            <span>
              {lang === "en" ? (
                <BiChevronRight size={20} />
              ) : (
                <BiChevronLeft size={20} />
              )}
            </span>
          </Link>
        )}
      </section>
    </div>
  );
};

export default RecentCustomers;
