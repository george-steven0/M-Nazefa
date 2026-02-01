import { useNavigate } from "react-router-dom";
import packageIcon from "../../../assets/imgs/packageIconDark.svg";
import { ConfigProvider, Switch } from "antd";
import type {
  APIErrorProps,
  packageCard,
} from "../../../components/Utilities/Types/types";
import { useAppSelector } from "../../../components/APIs/store";
import defImg from "../../../assets/imgs/logo.svg";
import { t } from "i18next";
import { useTogglePackageMutation } from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { toast } from "react-toastify";
type packageCardProps = {
  id: number | string;
  data: packageCard;
};
const PackageCard = ({ id, data }: packageCardProps) => {
  const { lang } = useAppSelector((state) => state.lang);

  const [togglePackage, { isLoading }] = useTogglePackageMutation();
  // console.log(data);

  const handleTogglePackage = async (status: boolean) => {
    const data = {
      packageId: id,
      isActive: status,
    };

    try {
      await togglePackage(data).unwrap();
      toast.success("Package status updated successfully");
    } catch (error) {
      const err = error as APIErrorProps;
      console.error(err);
      toast.error(`Failed to set package status`);
    }
  };

  const { title, arTitle, logo, isActive, description } = data;

  const navigate = useNavigate();
  const handleNavigateView = () => {
    navigate(`view-package?id=${id}`);
  };
  return (
    <div className="border bg-[#F5F4F4] border-[#c4c4c4] p-4 rounded-lg shadow-sm">
      <div className="w-full flex flex-col gap-4 relative max-h-[350px] overflow-hidden">
        <div
          className="card-img h-[150px] cursor-pointer overflow-hidden rounded-sm"
          onClick={handleNavigateView}
        >
          <img
            src={logo || defImg}
            className="size-full object-cover  transition-all duration-300 hover:scale-110"
          />
        </div>

        <div className="package-title flex items-center gap-2">
          <span>
            <img src={packageIcon} className="size-6" />
          </span>
          <p className="capitalize text-lg text-mainColor font-semibold">
            {title || arTitle ? (lang === "ar" ? arTitle : title) : t("NA")}
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
              defaultChecked={isActive}
              loading={isLoading}
              onClick={(checked, e) => {
                handleTogglePackage(checked);
                e?.stopPropagation();
              }}
            />
          </ConfigProvider>
        </div>

        <div className="card-description">
          <p title="" className="line-clamp-3 text-[#646363] text-sm">
            {description || t("NA")}
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

export default PackageCard;
