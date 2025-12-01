import { useNavigate, useSearchParams } from "react-router-dom";
import Title from "../../../components/Common/Title/title";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

const ViewService = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  //   console.log(id);

  const navigate = useNavigate();
  const handleNavigateButton = () => {
    const handleNavigate = () => {
      navigate(`/services/edit-service?id=${id}`);
    };
    return (
      <Button
        onClick={handleNavigate}
        className="bg-mainColor text-white py-5 min-w-[160px] capitalize"
      >
        {t("EDIT_SERVICE")}
      </Button>
    );
  };
  return (
    <div className="view-service-wrapper">
      <header className="view-service-title">
        <Title
          title={"service one"}
          subTitle
          component={handleNavigateButton}
        />
      </header>

      <section className="service-details-wrapper mt-6">
        <p className="max-w-[80%] md:max-w-[60%] text-[#646363]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil sed
          officiis sequi blanditiis assumenda porro perferendis, neque itaque
          laborum nam nemo quo deserunt maxime odit laudantium deleniti ut ipsam
          consequuntur!
        </p>

        <div className="mt-6 capitalize grid grid-cols-1 md:grid-cols-2 gap-5 justify-between [&>div>label]:block [&>div>label]:mb-1  [&>div>label]:font-semibold [&>div>label]:text-lg [&>div>label]:text-mainColor [&>div>span]:text-sm [&>div>span]:text-[#646363]">
          <div>
            <label>{t("PACKAGE")}</label>
            <span>5</span>
          </div>

          <div>
            <label>{t("EXTRA_SERVICE")}</label>
            <span>Cleaning of residential units</span>
          </div>

          <div className="col-span-full">
            <label>{t("DESCRIPTION")}</label>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              sunt, error voluptatem, velit quaerat eos voluptatibus facilis
              incidunt facere perspiciatis ut corrupti? Deleniti qui inventore
              deserunt voluptatum. Nihil, ab nulla?
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewService;
