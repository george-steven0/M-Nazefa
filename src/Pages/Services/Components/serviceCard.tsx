import { useNavigate } from "react-router-dom";
import packageIcon from "../../../assets/imgs/packageIconDark.svg";
import { ConfigProvider, Switch } from "antd";

const ServiceCard = ({ id }: { id: number }) => {
  console.log(id);

  const navigate = useNavigate();
  const handleNavigateView = () => {
    navigate(`view-service?id=${id}`);
  };
  return (
    <div className="border bg-[#F5F4F4] border-[#c4c4c4] p-4 rounded-lg shadow-sm">
      <div className="w-full flex flex-col gap-4 relative max-h-[350px] overflow-hidden">
        <div className="package-title flex items-center gap-2">
          <span>
            <img src={packageIcon} className="size-6" />
          </span>
          <p
            className="capitalize text-lg text-mainColor font-semibold cursor-pointer hover:text-mainColor/85"
            onClick={handleNavigateView}
          >
            service name
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
              loading={false}
              onClick={(_checked, e) => e?.stopPropagation()}
            />
          </ConfigProvider>
        </div>

        <div className="card-description">
          <p title="" className="line-clamp-3 text-[#646363] text-sm">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Laboriosam, rerum consequuntur voluptate expedita, non omnis
            reiciendis id consequatur necessitatibus doloremque, nulla facilis
            accusamus error corporis pariatur ab beatae sit molestias?
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
