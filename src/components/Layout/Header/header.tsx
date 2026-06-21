import { AiOutlineMenu } from "react-icons/ai";
// import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Button, Select, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { useAppDispatch } from "../../APIs/store";
import { changeLang } from "../../APIs/Language/lang";
import { useGetUserQuery } from "../../APIs/EmployeesQuery/EMPLOYEES_QUERY";

const languages = [
  { label: "EN", value: "en", countryCode: "US" },
  { label: "AR", value: "ar", countryCode: "EG" },
];

const Header = ({ toggleNav }: { toggleNav: () => void }) => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { data:user, isLoading:isUserLoading,isFetching:isUserFetching } = useGetUserQuery();

  const loadingUser = isUserFetching || isUserLoading

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    dispatch(changeLang(lang));
  };
  return (
    <div className="bg-lightGray w-full min-h-20 flex items-center justify-between md:justify-end px-8">
      <div className="block md:hidden">
        <Button
          onClick={toggleNav}
          className="bg-transparent border-none text-center "
          shape="circle"
          icon={<AiOutlineMenu className="text-mainColor" size={"100%"} />}
        />
      </div>

      <div className="flex items-center gap-5">
        {/* <section>
          <IoMdNotifications size={20} />
        </section> */}

        <section className="flex items-center gap-2">
          <FaUserCircle size={30} />
          <span className="capitalize text-sm">{loadingUser ? <Skeleton.Input size="small" active /> : user?.data?.firstName + " " + user?.data?.lastName}</span>
        </section>

        <section className="change-lang-wrapper">
          <Select
            value={i18n.language}
            onChange={changeLanguage}
            options={languages}
            optionRender={(option) => {
              const { label, countryCode } = option.data;

              return (
                <div className="flex items-center gap-2">
                  <ReactCountryFlag svg countryCode={countryCode} />
                  <span>{label}</span>
                </div>
              );
            }}
            labelRender={(option) => {
              const data = languages.find((l) => l.value === option.value);

              if (!data) return option.label;

              return (
                <div className="flex items-center gap-2">
                  <ReactCountryFlag svg countryCode={data.countryCode} />
                  <span>{data.label}</span>
                </div>
              );
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default Header;
