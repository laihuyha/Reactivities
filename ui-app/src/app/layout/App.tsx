import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../layout/styles/index.scss";
import Navbar from "./Navbar";
import HomePage from "../../features/home/HomePage";
import { configurePrimeReact } from "../config/primeReactConfig";
import { fontAwesomeConfig } from "../config/fontAwesomeConfig";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Outlet, useLocation } from "react-router-dom";
import InternalError from "../../features/errors/InternalError";
import Login from "../../features/users/Login";

const App = () => {
  configurePrimeReact();
  fontAwesomeConfig();
  const { appStore } = useStore();
  const { setToastRef, setUpToast } = appStore;
  const toast = useRef<Toast>(null);
  const location = useLocation();

  useEffect(() => {
    setToastRef(toast);
    setUpToast();
  }, [appStore, setToastRef, setUpToast]);

  const ToastElement = () => {
    return <Toast ref={toast} />;
  };

  const renderApp = () => {
    if (location.pathname === "/") {
      return <HomePage />;
    }
    if (location.pathname === "/server-error") {
      return <InternalError />;
    }
    if (location.pathname === "/login") {
      return (
        <>
          <ToastElement />
          <Login />
        </>
      );
    }
    return (
      <>
        <Navbar />
        <div className="layout-main-container">
          <div className="layout-main">
            <Outlet />
          </div>
          <ToastElement />
        </div>
      </>
    );
  };

  return <div className="layout-wrapper layout-static">{renderApp()}</div>;
};

export default observer(App);
