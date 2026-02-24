import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
import Notfound from "../../Pages/Notfound/notfound";
import CommingSoon from "../../Pages/CommingSoon/commingSoon";
import Employees from "../../Pages/Employees/employees";
import AddEmployee from "../../Pages/Employees/Components/addEmployee";
import EditEmployee from "../../Pages/Employees/Components/editEmployee";
import ViewEmployee from "../../Pages/Employees/Components/viewEmployee";
import Clients from "../../Pages/Clients/clients";
import AddClient from "../../Pages/Clients/Components/addClient";
import EditClient from "../../Pages/Clients/Components/editClient";
import ViewClient from "../../Pages/Clients/Components/viewClient";
import Packages from "../../Pages/Packages/packages";
// import AddPackage from "../../Pages/Packages/Components/addPackage";
// import EditPackage from "../../Pages/Packages/Components/editpackage";
import ViewPackage from "../../Pages/Packages/Components/viewPackage";
import Dashboard from "../../Pages/Dashboard/dashboard";
// import AddReservation from "../../Pages/Reservations/Components/addReservation";
// import EditReservation from "../../Pages/Reservations/Components/editReservation";
import ReservationDetails from "../../Pages/Reservations/Components/reservationDetails";
import { Reservations } from "../../Pages/Reservations/reservation";
import Services from "../../Pages/Services/services";
import AddService from "../../Pages/Services/Components/addService";
import EditService from "../../Pages/Services/Components/editService";
import ViewService from "../../Pages/Services/Components/viewService";
import Roles from "../../Pages/Roles/roles";
import Areas from "../../Pages/Area/area";
import Workers from "../../Pages/Workers/workers";
import Messages from "../../Pages/Messages/messages";
import Login from "../../Pages/Login/login";
import GuestRule from "./Roles/guestRole";
import ErrorBoundary from "../Utilities/ErrorBoundary/errorBoundary";
import GuardRole from "./Roles/guardRole";
import { PERMISSIONS } from "../../Utilities/permissions.config";
import Unauthorized from "../../Pages/Unauthorized/unauthorized";
import Memberships from "../../Pages/Membership/memberShip";
import PackageForm from "../../Pages/Packages/Components/packageForm";
import PackageTypes from "../../Pages/PackageTypes/packageTypes";
import CLeaningArea from "../../Pages/CleaningArea/cleaningArea";
import ReservationForm from "../../Pages/Reservations/Components/reservationForm";

export const routes = createBrowserRouter([
  // Guest Routes
  {
    element: <GuestRule />,
    children: [{ path: "/login", element: <Login /> }],
  },

  // Protected Routes
  {
    element: <GuardRole />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
            handle: {
              permission: PERMISSIONS.VIEW_DASHBOARD,
            },
          },

          // Dashboard
          {
            path: "dashboard",
            element: <Dashboard />,
            handle: {
              permission: PERMISSIONS.VIEW_DASHBOARD,
            },
          },

          // Profile placeholder
          {
            path: "profile",
            element: <CommingSoon />,
            handle: {
              permission: PERMISSIONS.PROFILE,
            },
          },

          // Employees (Admin Only)
          {
            path: "employees",
            element: <Employees />,
            handle: {
              permission: PERMISSIONS.VIEW_EMPLOYEE,
            },
            children: [
              {
                path: "add-employee",
                element: <AddEmployee />,
                handle: {
                  permission: PERMISSIONS.ADD_EMPLOYEE,
                },
              },
              {
                path: "edit-employee",
                element: <EditEmployee />,
                handle: {
                  permission: PERMISSIONS.EDIT_EMPLOYEE,
                },
              },
              { path: "view-employee", element: <ViewEmployee /> },
            ],
          },

          // Roles (Admin Only)
          {
            path: "roles",
            element: <Roles />,
            handle: {
              permission: PERMISSIONS.VIEW_ROLES,
            },
          },

          // Areas (Admin Only)
          {
            path: "areas",
            element: <Areas />,
            handle: {
              permission: PERMISSIONS.VIEW_AREAS,
            },
          },
          {
            path: "memberships",
            element: <Memberships />,
            handle: {
              permission: PERMISSIONS.VIEW_MEMBERSHIP,
            },
          },

          // Workers
          {
            path: "workers",
            element: <Workers />,
            handle: {
              permission: PERMISSIONS.VIEW_WORKERS,
            },
          },

          // Services
          {
            path: "services",
            element: <Services />,
            handle: {
              permission: PERMISSIONS.VIEW_SERVICE,
            },
            children: [
              {
                path: "add-service",
                element: <AddService />,
                handle: {
                  permission: PERMISSIONS.ADD_SERVICE,
                },
              },
              {
                path: "edit-service",
                element: <EditService />,
                handle: {
                  permission: PERMISSIONS.EDIT_SERVICE,
                },
              },
              { path: "view-service", element: <ViewService /> },
            ],
          },

          // Clients
          {
            path: "clients",
            element: <Clients />,
            handle: {
              permission: PERMISSIONS.VIEW_CLIENT,
            },
            children: [
              {
                path: "add-client",
                element: <AddClient />,
                handle: {
                  permission: PERMISSIONS.ADD_CLIENT,
                },
              },
              {
                path: "edit-client",
                element: <EditClient />,
                handle: {
                  permission: PERMISSIONS.EDIT_CLIENT,
                },
              },
              { path: "view-client", element: <ViewClient /> },
            ],
          },

          // Packages
          {
            path: "packages",
            element: <Packages />,
            handle: {
              permission: PERMISSIONS.VIEW_PACKAGE,
            },
            children: [
              {
                path: "add-package",
                element: <PackageForm />,
                handle: {
                  permission: PERMISSIONS.ADD_PACKAGE,
                },
              },
              {
                path: "edit-package",
                element: <PackageForm />,
                handle: {
                  permission: PERMISSIONS.EDIT_PACKAGE,
                },
              },
              { path: "view-package", element: <ViewPackage /> },
            ],
          },

          // Package Types
          {
            path: "package_types",
            element: <PackageTypes />,
            handle: {
              permission: PERMISSIONS.VIEW_PACKAGE_TYPE,
            },
          },

          // Cleaning Area
          {
            path: "cleaning_area",
            element: <CLeaningArea />,
            handle: {
              permission: PERMISSIONS.VIEW_CLEANING_AREA,
            },
          },

          // Reservations
          {
            path: "reservations",
            element: <Reservations />,
            handle: {
              permission: PERMISSIONS.VIEW_RESERVATION,
            },
            children: [
              {
                path: "add-reservation",
                element: <ReservationForm />,
                handle: {
                  permission: PERMISSIONS.ADD_RESERVATION,
                },
              },
              {
                path: "edit-reservation",
                element: <ReservationForm />,
                handle: {
                  permission: PERMISSIONS.EDIT_RESERVATION,
                },
              },
              { path: "reservation-details", element: <ReservationDetails /> },
            ],
          },

          // Messages
          {
            path: "messages",
            element: <Messages />,
          },
        ],
      },
    ],
  },

  // Not Found
  {
    path: "*",
    element: <Notfound />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
