import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-cente p-6">
      <div className="w-full max-w-2xl transform rounded-3xl p-10 text-center transition-all duration-500 hover:shadow-2xl md:p-16">
        <Result
          status="403"
          title={
            <h1 className="mb-4 text-5xl font-black text-mainColor tracking-wide">
              403
            </h1>
          }
          subTitle={
            <p className="mb-6 text-xl font-medium text-gray-500 leading-relaxed">
              {t("UNAUTHORIZED_ACCESS")}
            </p>
          }
          extra={
            <Button
              type="primary"
              size="large"
              className="mt-4 h-14 min-w-[200px] rounded-full text-lg font-bold shadow-md transition-transform hover:scale-105 hover:shadow-lg bg-mainColor! hover:bg-mainColor/90!"
              onClick={() => navigate("/")}
            >
              {t("BACK_HOME")}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default Unauthorized;
