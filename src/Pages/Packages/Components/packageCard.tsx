import { useNavigate } from "react-router-dom";
import { useState } from "react";
import packageIcon from "../../../assets/imgs/packageIconDark.svg";
import { ConfigProvider, Dropdown, Popconfirm, Switch } from "antd";
import type {
  APIErrorProps,
  packageCard,
} from "../../../components/Utilities/Types/types";
import { useAppSelector } from "../../../components/APIs/store";
import defImg from "../../../assets/imgs/logo.svg";
import { t } from "i18next";
import {
  useCopyPackageMutation,
  useDeletePackageMutation,
  useTogglePackageMutation,
} from "../../../components/APIs/Packages/PACKAGES_QUERY";
import { toast } from "react-toastify";
import { isAdmin, isSuperAdmin } from "../../../Utilities/utilities";
import { AiOutlineCopy, AiOutlineDelete } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
type packageCardProps = {
  id: number | string;
  data: packageCard;
};
const PackageCard = ({ id, data }: packageCardProps) => {
  const { lang } = useAppSelector((state) => state.lang);

  const [togglePackage, { isLoading }] = useTogglePackageMutation();
  const [deletePackage, { isLoading: isDeleteLoading }] =
    useDeletePackageMutation();
  const [copyPackage, { isLoading: isCopyLoading }] = useCopyPackageMutation();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleCopyPackage = async () => {
    try {
      await copyPackage({ id }).unwrap();
      toast.success(t("PACKAGE_COPIED_SUCCESS"));
    } catch (error) {
      const err = error as APIErrorProps;
      if (err?.data?.errorMessages?.length) {
        err.data.errorMessages.forEach((message) => toast.error(message));
      } else {
        toast.error(t("PACKAGE_COPY_FAILED"));
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

  const packageName = (lang === "ar" ? arTitle : title) || t("NA");

  const navigate = useNavigate();
  const handleNavigateView = () => {
    navigate(`view-package?id=${id}`);
  };
  return (
    <div className="border bg-[#F5F4F4] border-[#c4c4c4] p-4 rounded-lg shadow-sm">
      <div className="w-full flex flex-col gap-4 relative max-h-[350px] overflow-hidden">
        {canManage && (
          <Dropdown
            open={menuOpen}
            trigger={["click"]}
            placement="bottomRight"
            className="cursor-pointer"
            // Keep the menu open while interacting with its items so the
            // nested Popconfirm can appear; only trigger clicks toggle it.
            onOpenChange={(open, info) => {
              if (info.source === "menu") return;
              setMenuOpen(open);
            }}
            menu={{
              items: [
                {
                  key: "copy",
                  label: (
                    <Popconfirm
                      title={t("COPY_PACKAGE")}
                      description={t("COPY_PACKAGE_CONFIRM", {
                        name: packageName,
                      })}
                      okText={t("COPY")}
                      cancelText={t("CANCEL")}
                      okButtonProps={{ loading: isCopyLoading }}
                      onConfirm={() => {
                        handleCopyPackage();
                        setMenuOpen(false);
                      }}
                    >
                      <div
                        className="flex items-center gap-2 text-mainColor"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AiOutlineCopy size={16} />
                        {t("COPY_PACKAGE")}
                      </div>
                    </Popconfirm>
                  ),
                },
                {
                  key: "delete",
                  label: (
                    <Popconfirm
                      title={t("DELETE_PACKAGE")}
                      description={t("DELETE_PACKAGE_CONFIRM")}
                      okText={t("DELETE")}
                      cancelText={t("CANCEL")}
                      okButtonProps={{ danger: true, loading: isDeleteLoading }}
                      onConfirm={() => {
                        handleDeletePackage();
                        setMenuOpen(false);
                      }}
                    >
                      <div
                        className="flex items-center gap-2 text-mainRed"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AiOutlineDelete size={16} />
                        {t("DELETE_PACKAGE")}
                      </div>
                    </Popconfirm>
                  ),
                },
              ],
            }}
          >
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              aria-label={t("ACTIONS")}
              className="absolute top-2 end-2 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#646363] shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-mainColor hover:text-white hover:scale-110"
            >
              <BsThreeDotsVertical size={18} />
            </button>
          </Dropdown>
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
