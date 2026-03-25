import logo from "../../../assets/imgs/logo.svg";
import dashboardIcon from "../../../assets/imgs/dashboardIcon.svg";
import profileIcon from "../../../assets/imgs/profileIcon.svg";
import employeesIcon from "../../../assets/imgs/employeesIcon.svg";
import customersIcon from "../../../assets/imgs/customersIcon.svg";
import packagesIcon from "../../../assets/imgs/packagesIcon.svg";
import reservationIcon from "../../../assets/imgs/reservationIcon.svg";
import messagesIcon from "../../../assets/imgs/messagesIcon.svg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import navVector from "../../../assets/imgs/navbarVector.svg";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";
import {
  MdCardMembership,
  MdOutlineCleaningServices,
  MdOutlinePermContactCalendar,
} from "react-icons/md";
import { FaMapLocation } from "react-icons/fa6";
import { LuPackagePlus } from "react-icons/lu";
import { userRoles } from "../../../Utilities/utilities";
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
} from "../../../Utilities/permissions.config";

const Navbar = ({
  setToggle,
}: {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // console.log(userRoles);

  const allowedPermissions = userRoles.flatMap(
    (r) => ROLE_PERMISSIONS[r] || [],
  );

  const navLinks = [
    {
      id: "dashboard",
      name: t("DASHBOARD"),
      path: "/dashboard",
      icon: dashboardIcon,
      permissions: [PERMISSIONS.VIEW_DASHBOARD],
    },
    {
      id: "profile",
      name: t("PROFILE"),
      path: "/profile",
      icon: profileIcon,
      permissions: [PERMISSIONS.PROFILE],
    },
    {
      id: "employees",
      name: t("EMPLOYEES"),
      path: "/employees",
      icon: employeesIcon,
      permissions: [
        PERMISSIONS.ADD_EMPLOYEE,
        PERMISSIONS.EDIT_EMPLOYEE,
        PERMISSIONS.VIEW_EMPLOYEE,
      ],
    },
    {
      id: "roles",
      name: t("ROLES"),
      path: "/roles",
      icon: <MdOutlinePermContactCalendar />,
      iconType: "fontIcon",
      permissions: [PERMISSIONS.VIEW_ROLES],
    },
    {
      id: "area",
      name: t("AREA"),
      path: "/areas",
      icon: <FaMapLocation />,
      iconType: "fontIcon",
      permissions: [PERMISSIONS.VIEW_AREAS],
    },
    {
      id: "memberships",
      name: t("MEMBERSHIPS"),
      path: "/memberships",
      icon: <MdCardMembership />,
      iconType: "fontIcon",
      permissions: [PERMISSIONS.VIEW_MEMBERSHIP],
    },
    {
      id: "clients",
      name: t("CLIENTS"),
      path: "/clients",
      icon: customersIcon,
      permissions: [
        PERMISSIONS.ADD_CLIENT,
        PERMISSIONS.EDIT_CLIENT,
        PERMISSIONS.VIEW_CLIENT,
        PERMISSIONS.DELETE_CLIENT,
      ],
    },
    {
      id: "workers",
      name: t("WORKERS"),
      path: "/workers",
      icon: employeesIcon,
      permissions: [PERMISSIONS.VIEW_WORKERS],
    },
    {
      id: "services",
      name: t("SERVICES"),
      path: "/services",
      icon: customersIcon,
      permissions: [
        PERMISSIONS.ADD_SERVICE,
        PERMISSIONS.EDIT_SERVICE,
        PERMISSIONS.VIEW_SERVICE,
      ],
    },
    {
      id: "packages",
      name: t("PACKAGES"),
      path: "/packages",
      icon: packagesIcon,
      permissions: [
        PERMISSIONS.ADD_PACKAGE,
        PERMISSIONS.EDIT_PACKAGE,
        PERMISSIONS.VIEW_PACKAGE,
      ],
    },
    {
      id: "package_types",
      name: t("PACKAGE_TYPES"),
      path: "/package_types",
      icon: <LuPackagePlus />,
      iconType: "fontIcon",
      permissions: [
        PERMISSIONS.ADD_PACKAGE_TYPE,
        PERMISSIONS.EDIT_PACKAGE_TYPE,
        PERMISSIONS.VIEW_PACKAGE_TYPE,
      ],
    },
    {
      id: "cleaning_area",
      name: t("CLEANING_AREA"),
      path: "/cleaning_area",
      icon: <MdOutlineCleaningServices />,
      iconType: "fontIcon",
      permissions: [
        PERMISSIONS.ADD_CLEANING_AREA,
        PERMISSIONS.EDIT_CLEANING_AREA,
        PERMISSIONS.VIEW_CLEANING_AREA,
        PERMISSIONS.DELETE_CLEANING_AREA,
      ],
    },
    {
      id: "reservations",
      name: t("RESERVATIONS"),
      path: "/reservations",
      icon: reservationIcon,
      permissions: [
        PERMISSIONS.ADD_RESERVATION,
        PERMISSIONS.EDIT_RESERVATION,
        PERMISSIONS.DELETE_RESERVATION,
        PERMISSIONS.VIEW_RESERVATION,
      ],
    },
    {
      id: "messages",
      name: t("MESSAGES"),
      path: "/messages",
      icon: messagesIcon,
      permissions: [PERMISSIONS.VIEW_MESSAGES],
    },
  ];

  const filteredNavLinks = navLinks.filter((link) =>
    link.permissions.some((perm) => allowedPermissions.includes(perm)),
  );

  useEffect(() => {
    setToggle(true);
  }, [pathname]);

  const handleLogout = () => {
    navigate("/login");
    localStorage.clear();
  };
  return (
    <div className="size-full flex flex-col justify-between items-start">
      <div className="flex flex-col w-full py-6">
        <section className="nav-logo-wrapper flex justify-center">
          <img src={logo} alt="Madame Nazefa Logo" className="w-[180px] h-20" />
        </section>

        <section className="navbar-links-wrapper mt-6 w-full max-h-[calc(100vh-18rem)] overflow-y-auto">
          <div className="flex flex-col gap-5 w-full pl-14">
            {filteredNavLinks?.map((link) => (
              <NavLink
                key={link?.id}
                to={link?.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full p-3 rounded-tl-sm rounded-bl-sm capitalize ${
                    isActive
                      ? "text-white from-mainColor to-[#254F5F] bg-linear-to-r border-r-5 border-r-white"
                      : "text-mainGray"
                  }`
                }
              >
                {link?.iconType === "fontIcon" ? (
                  <span className="text-2xl">{link?.icon}</span>
                ) : (
                  <img
                    src={link?.icon as string}
                    alt={link?.id}
                    className="size-6"
                  />
                )}
                <span>{link?.name}</span>
              </NavLink>
            ))}
          </div>
        </section>
      </div>

      <section className="w-full">
        <div className="w-full mb-4 flex justify-center">
          <Button
            onClick={handleLogout}
            className="w-full max-w-[80%] z-999 font-semibold mb-8 text-white bg-transparent hover:bg-white hover:text-mainColor"
          >
            <span>
              <FaSignOutAlt size={18} />
            </span>
            <span>{t("LOGOUT")}</span>
          </Button>
        </div>
        <img
          src={navVector}
          alt={"vector circle"}
          className=" w-[60%] absolute bottom-0"
        />
      </section>
    </div>
  );
};

export default Navbar;
