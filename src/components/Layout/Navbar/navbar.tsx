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
import { Button, Collapse } from "antd";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";

import {
  MdCardMembership,
  MdOutlineCleaningServices,
  MdOutlinePermContactCalendar,
} from "react-icons/md";
import { FaMapLocation, FaVanShuttle } from "react-icons/fa6";
import { LuPackagePlus } from "react-icons/lu";
import {
  AiOutlineDashboard,
  AiOutlineTeam,
  AiOutlineAppstore,
  // AiOutlineSetting,
  AiOutlineTool,
} from "react-icons/ai";
import { getUserRoles } from "../../../Utilities/utilities";
import {
  PERMISSIONS,
  type Permission,
  ROLE_PERMISSIONS,
} from "../../../Utilities/permissions.config";
import { PiClockUser } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";

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
}: {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
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
        name: t("PEOPLE") || "People",
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
        ],
      },
      {
        id: "SETTINGS",
        name: t("SETTINGS") || "Settings",
        icon: <IoSettingsOutline />,
        children: [
          {
            id: "worker_management",
            name: t("WORKER_MANAGEMENT"),
            path: "/worker-management",
            icon: <PiClockUser />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_WORKER_MANAGEMENT],
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
            id: "complaints",
            name: t("COMPLAINTS"),
            path: "/complaints",
            icon: <RiCustomerService2Fill />,
            iconType: "fontIcon",
            permissions: [PERMISSIONS.VIEW_COMPLAINTS],
          },
          {
            id: "messages",
            name: t("MESSAGES"),
            path: "/messages",
            icon: messagesIcon,
            permissions: [PERMISSIONS.VIEW_MESSAGES],
          },
        ],
      },
      // {
      //   id: "settings",
      //   name: t("SETTINGS") || "Settings",
      //   icon: <AiOutlineSetting />,
      //   children: [

      //   ],
      // },
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
    navigate("/login");
    localStorage.clear();
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
        <section className="nav-logo-wrapper flex justify-center">
          <img src={logo} alt="Madame Nazefa Logo" className="w-[180px] h-20" />
        </section>

        <section className="navbar-links-wrapper mt-6 w-full max-h-[calc(100vh-18rem)] overflow-y-auto">
          <Collapse
            accordion
            ghost
            activeKey={openKeys}
            onChange={(key) => setOpenKeys(key)}
            expandIconPosition="end"
            className="navbar-accordion w-full [&_.ant-collapse-header]:text-white/40 [&_.ant-collapse-expand-icon]:text-white/40 [&_.ant-collapse-item-active>.ant-collapse-header]:text-white [&_.ant-collapse-item-active>.ant-collapse-header_.ant-collapse-expand-icon]:text-white [&_.ant-collapse-header]:transition-colors [&_.ant-collapse-header]:duration-300"
            items={collapseItems}
          />
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
