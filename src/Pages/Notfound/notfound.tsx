import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Notfound() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col gap-5 h-screen items-center justify-center">
      <h1 className="text-4xl text-mainColor">404 Page Not found</h1>
      <Button
        onClick={handleNavigation}
        className="text-white bg-mainColor! py-5 min-w-xl"
      >
        Go Back
      </Button>
    </div>
  );
}
