import { useNavigate, useSearchParams } from "react-router-dom";
import Title from "../../../components/Common/Title/title";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

const ViewPackage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  //   console.log(id);

  const navigate = useNavigate();
  const handleNavigateButton = () => {
    const handleNavigate = () => {
      navigate(`/packages/edit-package?id=${id}`);
    };
    return (
      <Button
        onClick={handleNavigate}
        className="bg-mainColor text-white py-5 min-w-[160px] capitalize"
      >
        {t("EDIT_PACKAGE")}
      </Button>
    );
  };
  return (
    <div className="view-package-wrapper">
      <header className="view-package-title">
        <Title
          title={"package one"}
          subTitle
          component={handleNavigateButton}
        />
      </header>

      <section className="package-details-wrapper mt-6">
        <p className="max-w-[80%] md:max-w-[60%] text-[#646363]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil sed
          officiis sequi blanditiis assumenda porro perferendis, neque itaque
          laborum nam nemo quo deserunt maxime odit laudantium deleniti ut ipsam
          consequuntur!
        </p>

        <div className="mt-6 capitalize grid grid-cols-1 md:grid-cols-2 gap-5 justify-between [&>div>label]:block [&>div>label]:mb-1  [&>div>label]:font-semibold [&>div>label]:text-lg [&>div>label]:text-mainColor [&>div>span]:text-sm [&>div>span]:text-[#646363]">
          <div>
            <label>{t("NO_WORKERS")}</label>
            <span>5</span>
          </div>

          <div>
            <label>{t("WORKING_HOURS")}</label>
            <span>2-4</span>
          </div>

          <div className="col-span-full">
            <label>{t("WHAT_HAVE")}</label>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              sunt, error voluptatem, velit quaerat eos voluptatibus facilis
              incidunt facere perspiciatis ut corrupti? Deleniti qui inventore
              deserunt voluptatum. Nihil, ab nulla?
            </span>
          </div>

          <div className="col-span-full">
            <label>{t("WHAT_NOT_HAVE")}</label>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              sunt, error voluptatem, velit quaerat eos voluptatibus facilis
              incidunt facere perspiciatis ut corrupti? Deleniti qui inventore
              deserunt voluptatum. Nihil, ab nulla?
            </span>
          </div>

          <div>
            <label>{t("RULES")}</label>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              sunt, error voluptatem, velit quaerat eos voluptatibus facilis
              incidunt facere perspiciatis ut corrupti? Deleniti qui inventore
              deserunt voluptatum. Nihil, ab nulla?
            </span>
          </div>

          <div>
            <label>{t("TERMS")}</label>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              sunt, error voluptatem, velit quaerat eos voluptatibus facilis
              incidunt facere perspiciatis ut corrupti? Deleniti qui inventore
              deserunt voluptatum. Nihil, ab nulla?
            </span>
          </div>

          <div>
            <label>{t("TOOLS")}</label>
            <span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              sunt, error voluptatem, velit quaerat eos voluptatibus facilis
              incidunt facere perspiciatis ut corrupti? Deleniti qui inventore
              deserunt voluptatum. Nihil, ab nulla?
            </span>
          </div>

          <div>
            <label>{t("SUPPLIES")}</label>
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

export default ViewPackage;
