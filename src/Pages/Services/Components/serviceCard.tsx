import { useNavigate } from "react-router-dom";
import packageIcon from "../../../assets/imgs/packageIconDark.svg";
import { ConfigProvider, Switch } from "antd";
import { useToggleServiceMutation } from "../../../components/APIs/Services/SERVICES_QUERY";
import { toast } from "react-toastify";
import type { APIErrorProps, serviceFormProps } from "../../../components/Utilities/Types/types";

type serviceCardProps = {
  data:serviceFormProps,
  lang:string
}
const ServiceCard = ({ data,lang }:serviceCardProps) => {

  const navigate = useNavigate();
  const handleNavigateView = () => {
    navigate(`view-service?id=${data?.id}`);
  };

  const [toggleService,{isLoading: toggleLoading, isSuccess: toggleSuccess}] = useToggleServiceMutation();

  const toggleServiceSwitch = async (checked:boolean)=>{
    try {
        await toggleService({serviceId: data?.id || '', isActive: checked}).unwrap();
        if (toggleSuccess) {
          toast.success("Service toggled successfully");
        }
    } catch (error) {
       const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => {
        toast.error(message);
      });
    }
  }

  return (
    <div
      className="border bg-[#F5F4F4] border-[#c4c4c4] p-4 rounded-lg shadow-sm cursor-pointer"
      onClick={handleNavigateView}
    >
      <div className="w-full flex flex-col gap-4 relative max-h-[350px] overflow-hidden">
        <div className="package-title flex items-center gap-2">
          <span>
            <img src={packageIcon} className="size-6" />
          </span>
          <p
            className="capitalize text-lg text-mainColor font-semibold cursor-pointer hover:text-mainColor/85"
            onClick={handleNavigateView}
          >
            {lang === 'en' ? data?.title : data?.arTitle}
          </p>
        </div>

        <div className="card-toggle-btn">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#32D74B",
              },
            }}
          >
            <Switch
              defaultChecked={data?.isActive}
              loading={toggleLoading}
              onClick={(_checked, e) => {
                e?.stopPropagation();
                toggleServiceSwitch(_checked);
              }}

            />
          </ConfigProvider>
        </div>

        <div className="card-description">
          <p title="" className="line-clamp-3 text-[#646363] text-sm">
            {data?.description || 'No Description'}
          </p>
        </div>

        {/* {id % 2 === 0 ? (
          <div className="card-discount-label">
            <span className="min-w-[60px] min-h-[25px] flex items-center justify-center bg-red-600 text-white text-sm rounded-sm absolute top-2 right-2 ">
              10%
            </span>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default ServiceCard;
