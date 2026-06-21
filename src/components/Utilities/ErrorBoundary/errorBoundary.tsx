import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  let title = t("SOMETHING_WENT_WRONG");
  let subTitle = t("UNEXPECTED_ERROR_MESSAGE");
  let status: "403" | "404" | "500" | "error" = "error";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "404";
      subTitle = t("PAGE_NOT_FOUND_MESSAGE");
      status = "404";
    } else if (error.status === 401) {
      title = "401";
      subTitle = t("UNAUTHORIZED_ACCESS");
      status = "403";
    } else if (error.status === 503) {
      title = "503";
      subTitle = t("SERVICE_UNAVAILABLE_MESSAGE");
      status = "500";
    } else {
      title = t("ERROR_TITLE");
      subTitle = error.statusText || error.data?.message || "Unknown Error";
      status = "error";
    }
  } else if (error instanceof Error) {
    subTitle = error.message;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/")}
            className="bg-mainColor hover:bg-mainColor/90"
          >
            {t("BACK_HOME")}
          </Button>
        }
      />
    </div>
  );
};

export default ErrorBoundary;
