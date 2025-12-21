import { useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout/layout";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  return (
    <>
      <Layout />
    </>
  );
}

export default App;
