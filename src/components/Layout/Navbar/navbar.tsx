import logo from "../../../assets/imgs/logo.svg";
import dashboardIcon from "../../../assets/imgs/dashboardIcon.svg";
import profileIcon from "../../../assets/imgs/profileIcon.svg";
import employeesIcon from "../../../assets/imgs/employeesIcon.svg";
import customersIcon from "../../../assets/imgs/customersIcon.svg";
import packagesIcon from "../../../assets/imgs/packagesIcon.svg";
import reservationIcon from "../../../assets/imgs/reservationIcon.svg";
import messagesIcon from "../../../assets/imgs/messagesIcon.svg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import navVector from "../../../assets/imgs/navbarVector.svg";
import { Button, Collapse, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";

import {
  MdCardMembership,
  MdOutlineCleaningServices,
  MdOutlineFeedback,
  MdOutlinePermContactCalendar,
} from "react-icons/md";
import { FaMapLocation, FaVanShuttle } from "react-icons/fa6";
import { LuPackagePlus, LuCalendarDays } from "react-icons/lu";
import { GiToolbox } from "react-icons/gi";
import {
  AiOutlineDashboard,
  AiOutlineTeam,
  AiOutlineAppstore,
  // AiOutlineSetting,
  AiOutlineTool,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { getUserRoles } from "../../../Utilities/utilities";
import {
  PERMISSIONS,
  type Permission,
  ROLE_PERMISSIONS,
} from "../../../Utilities/permissions.config";
import { PiClockUser } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { logout } from "../../../Utilities/auth";

// ─── Types ───────────────────────────────────────────────────────────────────

type NavLinkItem = {
  id: string;
  name: string;
  path: string;
  icon: string | React.ReactNode;
  iconType?: "fontIcon";
  permissions: Permission[];
};

type NavGroup = {
  id: string;
  name: string;
  icon: React.ReactNode;
  children: NavLinkItem[];
};

// ─── Component ───────────────────────────────────────────────────────────────

const Navbar = ({
  setToggle,
  collapsed,
  setCollapsed,
}: {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // ── Grouped navigation (ordered by usage frequency) ──────────────────────

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        id: "overview",
        name: t("OVERVIEW") || "Overview",
        icon: <AiOutlineDashboard />,
        children: [
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
        ],
      },
      {
        id: "people",
        name: t("PEOPLE") || "People & workforce",
        icon: <AiOutlineTeam />,
        children: [
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
            id: "worker_management",
            name: t("WORKER_MANAGEMENT"),
            path: "/worker-management",
            icon: <PiClockUser />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_WORKER_MANAGEMENT],
          },
        ],
      },
      {
        id: "services_packages",
        name: t("SERVICE_PACKAGES") || "Services & Packages",
        icon: <AiOutlineAppstore />,
        children: [
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
            id: "tools",
            name: t("TOOLS"),
            path: "/tools",
            icon: <GiToolbox />,
            iconType: "fontIcon",
            permissions: [
              PERMISSIONS.ADD_TOOL,
              PERMISSIONS.EDIT_TOOL,
              PERMISSIONS.VIEW_TOOL,
            ],
          },
        ],
      },
      {
        id: "operations",
        name: t("OPERATIONS") || "Operations",
        icon: <AiOutlineTool />,
        children: [
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
            id: "calendar",
            name: t("CALENDAR"),
            path: "/calendar",
            icon: <LuCalendarDays />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_RESERVATION],
          },
          {
            id: "complaints",
            name: t("COMPLAINTS"),
            path: "/complaints",
            icon: <RiCustomerService2Fill />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_COMPLAINTS],
          },
          {
            id: "reservation_feedback",
            name: t("FEEDBACKS"),
            path: "/reservation-feedback",
            icon: <MdOutlineFeedback />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_RESERVATION_FEEDBACK],
          },
          {
            id: "messages",
            name: t("MESSAGES"),
            path: "/messages",
            icon: messagesIcon,
            permissions: [PERMISSIONS.VIEW_MESSAGES],
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
            id: "area",
            name: t("AREA"),
            path: "/areas",
            icon: <FaMapLocation />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_AREAS],
          },
          {
            id: "transportations",
            name: t("TRANSPORTATION_FEES"),
            path: "/transportations",
            icon: <FaVanShuttle />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_TRANSPORTATION],
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
            id: "cleaning_area_service",
            name: t("CLEANING_AREA_SERVICES"),
            path: "/cleaning_area_service",
            icon: <AiOutlineTool />,
            iconType: "fontIcon",
            permissions: [
              PERMISSIONS.ADD_CLEANING_AREA_SERVICE,
              PERMISSIONS.EDIT_CLEANING_AREA_SERVICE,
              PERMISSIONS.VIEW_CLEANING_AREA_SERVICE,
              PERMISSIONS.DELETE_CLEANING_AREA_SERVICE,
            ],
          },
        ],
      },
      {
        id: "access_control",
        name: t("ACCESS_CONTROL") || "Access control",
        icon: <IoSettingsOutline />,
        children: [
          {
            id: "roles",
            name: t("ROLES"),
            path: "/roles",
            icon: <MdOutlinePermContactCalendar />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_ROLES],
          },
        ],
      },
    ],
    [t],
  );

  // ── Permissions ──────────────────────────────────────────────────────────

  const allowedPermissions = useMemo(() => {
    const userRoles = getUserRoles(); // ✅ fresh read on every navigation
    return userRoles.flatMap((r) => ROLE_PERMISSIONS[r] || []);
  }, [pathname]);

  /** Filter each group's children by permission, then drop empty groups */
  const visibleGroups = useMemo(() => {
    return navGroups
      .map((group) => ({
        ...group,
        children: group.children.filter((link) =>
          link.permissions.some((perm) => allowedPermissions.includes(perm)),
        ),
      }))
      .filter((group) => group.children.length > 0);
  }, [allowedPermissions, navGroups]);

  const [openKeys, setOpenKeys] = useState<string | string[]>([]);

  /** Auto-expand the group that contains the current active route */
  useEffect(() => {
    let found = false;
    for (const group of visibleGroups) {
      if (
        group.children.some(
          (link) =>
            pathname === link.path || pathname.startsWith(`${link.path}/`),
        )
      ) {
        setOpenKeys([group.id]);
        found = true;
        break;
      }
    }
    if (!found) {
      setOpenKeys([]);
    }
  }, [pathname, visibleGroups]);

  // ── Side-effects ─────────────────────────────────────────────────────────

  useEffect(() => {
    setToggle(true);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── Render helpers ───────────────────────────────────────────────────────

  const renderLink = (link: NavLinkItem) => (
    <NavLink
      key={link.id}
      to={link.path}
      className={({ isActive }) => {
        const isLinkActive =
          pathname === link.path ||
          pathname.startsWith(`${link.path}/`) ||
          isActive;
        return `flex items-center gap-2 w-full p-2.5 rounded-tl-sm rounded-bl-sm capitalize text-[#ebebeb] transition-all duration-300 hover:bg-linear-to-r hover:from-mainColor hover:to-[#254F5F] hover:border-r-5 hover:border-r-white hover:opacity-100 ${
          isLinkActive
            ? " from-mainColor to-[#254F5F] bg-linear-to-r border-r-5 border-r-white opacity-100"
            : "opacity-40"
        }`;
      }}
    >
      {link.iconType === "fontIcon" ? (
        <span className="text-xl">{link.icon}</span>
      ) : (
        <img src={link.icon as string} alt={link.id} className="size-5" />
      )}
      <span className="text-sm">{link.name}</span>
    </NavLink>
  );

  /** Icon-only link (used when the navbar is collapsed) with a tooltip. */
  const renderCollapsedLink = (link: NavLinkItem) => (
    <Tooltip key={link.id} title={link.name} placement="right">
      <NavLink
        to={link.path}
        className={({ isActive }) => {
          const isLinkActive =
            pathname === link.path ||
            pathname.startsWith(`${link.path}/`) ||
            isActive;
          return `flex items-center justify-center w-full p-3 rounded-md capitalize text-[#ebebeb] transition-all duration-300 hover:bg-linear-to-r hover:from-mainColor hover:to-[#254F5F] hover:opacity-100 ${
            isLinkActive
              ? " from-mainColor to-[#254F5F] bg-linear-to-r opacity-100"
              : "opacity-40"
          }`;
        }}
      >
        {link.iconType === "fontIcon" ? (
          <span className="text-xl">{link.icon}</span>
        ) : (
          <img src={link.icon as string} alt={link.id} className="size-5" />
        )}
      </NavLink>
    </Tooltip>
  );

  const collapseItems = visibleGroups.map((group) => ({
    key: group.id,
    label: (
      <span className="flex items-center gap-2 capitalize font-semibold transition-colors duration-300">
        <span className="text-lg">{group.icon}</span>
        <span className="text-sm">{group.name}</span>
      </span>
    ),
    children: (
      <div className="flex flex-col gap-1">
        {group.children.map(renderLink)}
      </div>
    ),
  }));

  // ── JSX ──────────────────────────────────────────────────────────────────

  return (
    <div className="size-full flex flex-col justify-between items-start">
      <div className="flex flex-col w-full py-6">
        <section
          className={`nav-logo-wrapper flex items-center ${
            collapsed ? "flex-col gap-4 justify-center" : "justify-between px-4"
          }`}
        >
          <img
            src={logo}
            alt="Madame Nazefa Logo"
            className={
              collapsed ? "w-10 h-10 object-contain" : "w-[150px] h-16"
            }
          />
          <div className="hidden md:block">
            <Button
              onClick={() => setCollapsed((prev) => !prev)}
              className="bg-transparent border-none text-white/70 hover:text-white! hover:bg-white/10!"
              shape="circle"
              aria-label={t("TOGGLE_MENU") || "Toggle menu"}
              icon={
                collapsed ? (
                  <AiOutlineMenuUnfold size={20} />
                ) : (
                  <AiOutlineMenuFold size={20} />
                )
              }
            />
          </div>
        </section>

        <section className="navbar-links-wrapper mt-6 w-full max-h-[calc(100vh-18rem)] overflow-y-auto">
          {collapsed ? (
            <div className="flex flex-col items-center gap-1 px-2">
              {visibleGroups
                .flatMap((group) => group.children)
                .map(renderCollapsedLink)}
            </div>
          ) : (
            <Collapse
              accordion
              ghost
              activeKey={openKeys}
              onChange={(key) => setOpenKeys(key)}
              expandIconPosition="end"
              className="navbar-accordion w-full [&_.ant-collapse-header]:text-white/40 [&_.ant-collapse-expand-icon]:text-white/40 [&_.ant-collapse-item-active>.ant-collapse-header]:text-white [&_.ant-collapse-item-active>.ant-collapse-header_.ant-collapse-expand-icon]:text-white [&_.ant-collapse-header]:transition-colors [&_.ant-collapse-header]:duration-300"
              items={collapseItems}
            />
          )}
        </section>
      </div>

      <section className="w-full">
        <div className="w-full mb-4 flex justify-center">
          {collapsed ? (
            <Tooltip title={t("LOGOUT")} placement="right">
              <Button
                onClick={handleLogout}
                shape="circle"
                aria-label={t("LOGOUT")}
                className="z-999 mb-8 text-white bg-transparent hover:bg-white hover:text-mainColor"
                icon={<FaSignOutAlt size={18} />}
              />
            </Tooltip>
          ) : (
            <Button
              onClick={handleLogout}
              className="w-full max-w-[80%] z-999 font-semibold mb-8 text-white bg-transparent hover:bg-white hover:text-mainColor"
            >
              <span>
                <FaSignOutAlt size={18} />
              </span>
              <span>{t("LOGOUT")}</span>
            </Button>
          )}
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
