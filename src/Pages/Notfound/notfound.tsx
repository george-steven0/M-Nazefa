import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getFirstAllowedPath } from "../../Utilities/utilities";

export default function Notfound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 h-screen items-center justify-center">
      {/* <h1 className="text-4xl text-mainColor">404 Page Not found</h1>
      <Button
        onClick={handleNavigation}
        className="text-white bg-mainColor! py-5 min-w-xl"
      >
        Go Home
      </Button> */}

      <Result
        status="404"
        title="404"
        subTitle={t("PAGE_NOT_FOUND_MESSAGE")}
        extra={
          <Button
            onClick={() => navigate(getFirstAllowedPath())}
            type="primary"
            className=" py-5 min-w-xl"
          >
            {t("GO_HOME")}
          </Button>
        }
      />
    </div>
  );
}
