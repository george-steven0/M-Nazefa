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

  let title = "Something went wrong";
  let subTitle = "Sorry, an unexpected error has occurred.";
  let status: "403" | "404" | "500" | "error" = "error";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "404";
      subTitle = "Sorry, the page you visited does not exist.";
      status = "404";
    } else if (error.status === 401) {
      title = "401";
      subTitle = "Sorry, you are not authorized to access this page.";
      status = "403";
    } else if (error.status === 503) {
      title = "503";
      subTitle = "Sorry, our service is currently unavailable.";
      status = "500";
    } else {
      title = "Error";
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
            {t("Back Home")}
          </Button>
        }
      />
    </div>
  );
};

export default ErrorBoundary;
