import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { routes } from "./components/Routes/routes.tsx";
import "./components/Utilities/locale/i18.ts";
import "@ant-design/v5-patch-for-react-19";
import { Provider } from "react-redux";
import { store } from "./components/APIs/store.ts";
createRoot(document.getElementById("nazefa")!).render(
  <StrictMode>
    <ToastContainer
      closeOnClick
      position="top-center"
      pauseOnHover
      autoClose={5000}
    />
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
    {/* <App /> */}
  </StrictMode>
);
