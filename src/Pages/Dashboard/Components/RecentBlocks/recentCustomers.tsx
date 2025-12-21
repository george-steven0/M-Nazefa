import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";
import type { translationType } from "../../../../components/Utilities/Types/types";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../../components/APIs/store";

const RecentCustomers = ({ t }: translationType) => {
  const { lang } = useAppSelector((state) => state.lang);
  // console.log(lang);

  const topThree = [
    {
      id: 1,
      name: "Jenny willson",
      email: "email@example.com",
    },
    {
      id: 2,
      name: "mark samy",
      email: "email2@example.com",
    },
    {
      id: 3,
      name: "alex hunter",
      email: "email3@example.com",
    },
  ];
  return (
    <div className="block-container h-full flex flex-col justify-between">
      <section className="block-title mb-4">
        <p className="text-lg font-bold text-mainTextDark capitalize ">
          {t("RECEN_CUSTOMERS")}
        </p>
      </section>

      <section className="recent-customers-list-wrapper">
        <ul className="flex flex-col gap-5">
          {topThree?.map((customer) => (
            <li key={customer?.id} className="flex items-center gap-2">
              <div className="customer-img">
                <RxAvatar size={35} />
              </div>

              <div className="flex flex-col gap-1 justify-between">
                <p className="text-sm font-bold text-mainTextDark capitalize">
                  {customer?.name}
                </p>
                <p className="text-sm font-normal text-mainTextLight">
                  {customer?.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 capitalize text-[#151518] text-sm">
        <Link to="/" className="flex items-center gap-1">
          <span>{t("SEE_ALL_CUSTOMERS")}</span>
          <span>
            {lang === "en" ? (
              <BiChevronRight size={20} />
            ) : (
              <BiChevronLeft size={20} />
            )}
          </span>
        </Link>
      </section>
    </div>
  );
};

export default RecentCustomers;
