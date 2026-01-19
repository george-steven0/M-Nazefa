import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
// import Home from "../../Pages/Home/home";
import Notfound from "../../Pages/Notfound/notfound";
import CommingSoon from "../../Pages/CommingSoon/commingSoon";
import Employees from "../../Pages/Employees/employees";
import AddEmployee from "../../Pages/Employees/Components/addEmployee";
import EditEmployee from "../../Pages/Employees/Components/editEmployee";
import ViewEmployee from "../../Pages/Employees/Components/viewEmployee";
import Clients from "../../Pages/Clients/clients";
import AddClient from "../../Pages/Clients/Components/addClient";
import EditClient from "../../Pages/Clients/Components/editClient";
import Packages from "../../Pages/Packages/packages";
import AddPackage from "../../Pages/Packages/Components/addPackage";
import EditPackage from "../../Pages/Packages/Components/editpackage";
import ViewPackage from "../../Pages/Packages/Components/viewPackage";
import Dashboard from "../../Pages/Dashboard/dashboard";
import AddReservation from "../../Pages/Reservations/Components/addReservation";
import ReservationDetails from "../../Pages/Reservations/Components/reservationDetails";
import { Reservations } from "../../Pages/Reservations/reservation";
import EditReservation from "../../Pages/Reservations/Components/editReservation";
import ErrorBoundary from "../Utilities/ErrorBoundary/errorBoundary";
import Workers from "../../Pages/Workers/workers";
import Services from "../../Pages/Services/services";
import AddService from "../../Pages/Services/Components/addService";
import EditService from "../../Pages/Services/Components/editService";
import ViewService from "../../Pages/Services/Components/viewService";
import Messages from "../../Pages/Messages/messages";
import Login from "../../Pages/Login/login";
import AuthRule from "./Rules/authRole";
import GuestRule from "./Rules/guestRole";
import Roles from "../../Pages/Roles/roles";
import ViewClient from "../../Pages/Clients/Components/viewClient";
import Areas from "../../Pages/Area/area";

export const routes = createBrowserRouter([
  {
    element: <GuestRule />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <AuthRule />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            id: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "/profile",
            id: "profile",
            element: <CommingSoon />,
          },
          {
            id: "employees",
            path: "/employees",
            element: <Employees />,
            children: [
              {
                id: "add-employee",
                path: "add-employee",
                element: <AddEmployee />,
              },
              {
                id: "edit-employee",
                path: "edit-employee",
                element: <EditEmployee />,
              },
              {
                id: "view-employee",
                path: "view-employee",
                element: <ViewEmployee />,
              },
            ],
          },
          {
            id: "roles",
            path: "/roles",
            element: <Roles />,
          },
          {
            id: "areas",
            path: "/areas",
            element: <Areas />,
          },
          {
            id: "workers",
            path: "/workers",
            element: <Workers />,
          },
          {
            id: "services",
            path: "/services",
            element: <Services />,
            children: [
              {
                id: "add-service",
                path: "add-service",
                element: <AddService />,
              },
              {
                id: "edit-service",
                path: "edit-service",
                element: <EditService />,
              },
              {
                id: "view-service",
                path: "view-service",
                element: <ViewService />,
              },
            ],
          },
          {
            id: "clients",
            path: "/clients",
            element: <Clients />,
            children: [
              {
                id: "add-client",
                path: "add-client",
                element: <AddClient />,
              },
              {
                id: "edit-client",
                path: "edit-client",
                element: <EditClient />,
              },
              {
                id: "view-client",
                path: "view-client",
                element: <ViewClient />,
              },
            ],
          },
          {
            id: "packages",
            path: "/packages",
            element: <Packages />,
            children: [
              {
                id: "add-package",
                path: "add-package",
                element: <AddPackage />,
              },
              {
                id: "edit-package",
                path: "edit-package",
                element: <EditPackage />,
              },
              {
                id: "view-package",
                path: "view-package",
                element: <ViewPackage />,
              },
            ],
          },
          {
            id: "reservations",
            path: "/reservations",
            element: <Reservations />,
            children: [
              {
                id: "add-reservation",
                path: "add-reservation",
                element: <AddReservation />,
              },
              {
                id: "edit-reservation",
                path: "edit-reservation",
                element: <EditReservation />,
              },
              {
                id: "reservation-details",
                path: "reservation-details",
                element: <ReservationDetails />,
              },
            ],
          },
          {
            id: "messages",
            path: "/messages",
            element: <Messages />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Notfound />,
  },
]);
