import { Button, Image } from "antd";
import { useTranslation } from "react-i18next";
import img from "../../../assets/imgs/avatar.png";
import { useNavigate, useSearchParams } from "react-router-dom";
const ViewEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const handleNavigateEdit = () => {
    navigate(`/employees/edit-employee?id=${id}`);
  };
  return (
    <div className="view-employee-container">
      <header className="view-employee-header flex items-center justify-between">
        <div className="flex items-center gap-3 [&>div>.ant-image-mask]:rounded-full">
          <Image
            src={img}
            alt="User Image"
            className="size-[150px] rounded-full overflow-hidden ff"
          />

          <div className="flex flex-col gap-2 capitalize">
            <p className="text-[#1D1B1B] font-medium">user name</p>
            <p className="text-mainGray text-[18px] font-normal">admin</p>
          </div>
        </div>

        <div className="header-btn">
          <Button
            onClick={handleNavigateEdit}
            className="text-sm bg-mainColor text-[#FEFEFE] min-w-[100px] md:min-w-[150px] py-5 capitalize"
          >
            {t("EDIT_PROFILE")}
          </Button>
        </div>
      </header>

      <main className="view-employee-container mt-8 capitalize">
        <section className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[50%] grid grid-cols-1 gap-y-4 [&>div]:grid [&>div]:grid-cols-2 [&>div]:gap-x-3 [&>div]:pb-2 [&>div:last-child]:border-none [&>div]:border-b [&>div]:border-dashed [&>div]:border-[#A2A2A2] [&>div>span]:font-normal [&>div>span]:text-[18px] [&>div>span:first-child]:text-[#1D1B1B] [&>div>span:last-child]:text-[#646363] ">
          <div>
            <span>{t("FULL_NAME")}</span>
            <span>Hany Samir</span>
          </div>

          <div>
            <span>{t("GENDER")}</span>
            <span>Male</span>
          </div>

          <div>
            <span>{t("PHONE_NUMBER")}</span>
            <span>+25545645646</span>
          </div>

          <div>
            <span>{t("EMAIL")}</span>
            <span>test@email.com</span>
          </div>

          <div>
            <span>{t("DATE_OF_BIRTH")}</span>
            <span>25-11-1996</span>
          </div>

          <div>
            <span>{t("EMPLOYEE_ROLE")}</span>
            <span>Admin</span>
          </div>

          <div>
            <span>{t("WORD_ID")}</span>
            <span>TS584HYY74</span>
          </div>

          <div>
            <span>{t("STARTING_DATE")}</span>
            <span>10-10-2020</span>
          </div>

          <div>
            <span>{t("ID_NUMBER")}</span>
            <span>456465458654565645</span>
          </div>

          <div>
            <span>{t("POSTAL_CODE")}</span>
            <span>74544</span>
          </div>

          <div>
            <span>{t("ADDRESS")}</span>
            <span>1ST- new cairo - egypt</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewEmployee;
