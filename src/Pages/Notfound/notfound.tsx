import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { getFirstAllowedPath } from "../../Utilities/utilities";

export default function Notfound() {
  const navigate = useNavigate();

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
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            onClick={() => navigate(getFirstAllowedPath())}
            type="primary"
            className=" py-5 min-w-xl"
          >
            Go Home
          </Button>
        }
      />
    </div>
  );
}
