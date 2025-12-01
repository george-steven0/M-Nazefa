import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { routes } from "./components/Routes/routes.tsx";
import "./components/Utilities/locale/i18.ts";
import "@ant-design/v5-patch-for-react-19";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      closeOnClick
      position="top-center"
      pauseOnHover
      autoClose={5000}
    />
    <RouterProvider router={routes} />
    {/* <App /> */}
  </StrictMode>
);
