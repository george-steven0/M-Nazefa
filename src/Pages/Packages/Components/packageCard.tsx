import { useNavigate } from "react-router-dom";
import packageIcon from "../../../assets/imgs/packageIconDark.svg";
import { ConfigProvider, Popconfirm, Switch } from "antd";
import type {
  APIErrorProps,
  packageCard,
} from "../../../components/Utilities/Types/types";
import { useAppSelector } from "../../../components/APIs/store";
import defImg from "../../../assets/imgs/logo.svg";
import { t } from "i18next";
import {
  useDeletePackageMutation,
  useTogglePackageMutation,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { toast } from "react-toastify";
import { isAdmin, isSuperAdmin } from "../../../Utilities/utilities";
import { AiOutlineDelete } from "react-icons/ai";
type packageCardProps = {
  id: number | string;
  data: packageCard;
};
const PackageCard = ({ id, data }: packageCardProps) => {
  const { lang } = useAppSelector((state) => state.lang);

  const [togglePackage, { isLoading }] = useTogglePackageMutation();
  const [deletePackage, { isLoading: isDeleteLoading }] =
    useDeletePackageMutation();
  // console.log(data);

  const canManage = isAdmin() || isSuperAdmin();

  const handleDeletePackage = async () => {
    try {
      await deletePackage({ id }).unwrap();
      toast.success(t("PACKAGE_DELETED_SUCCESS"));
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages?.length) {
        err.data.errorMessages.forEach((message) => toast.error(message));
      } else {
        toast.error(t("PACKAGE_DELETE_FAILED"));
      }
    }
  };

  const handleTogglePackage = async (status: boolean) => {
    if (!isAdmin() && !isSuperAdmin()) {
      toast.error(t("UNAUTHORIZED_ACTION"), {
        toastId: "unauthorized",
      });
      return;
    }
    const data = {
      packageId: id,
      isActive: status,
    };

    try {
      await togglePackage(data).unwrap();
      toast.success(t("PACKAGE_STATUS_UPDATED_SUCCESS"));
    } catch (error) {
      const err = error as APIErrorProps;
      console.error(err);
      toast.error(t("PACKAGE_STATUS_FAILED"));
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
        {canManage && (
          <Popconfirm
            title={t("DELETE_PACKAGE")}
            description={t("DELETE_PACKAGE_CONFIRM")}
            okText={t("DELETE")}
            cancelText={t("CANCEL")}
            okButtonProps={{ danger: true, loading: isDeleteLoading }}
            onConfirm={handleDeletePackage}
          >
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              aria-label={t("DELETE_PACKAGE")}
              className="absolute top-2 end-2 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-mainRed shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-mainRed hover:text-white hover:scale-110"
            >
              <AiOutlineDelete size={18} />
            </button>
          </Popconfirm>
        )}
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
          {isAdmin() || isSuperAdmin() ? (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#32D74B",
                },
              }}
            >
              <Switch
                // defaultChecked={isActive}
                loading={isLoading}
                checked={isActive}
                onChange={(checked, e) => {
                  handleTogglePackage(checked);
                  e?.stopPropagation();
                }}
              />
            </ConfigProvider>
          ) : null}
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
