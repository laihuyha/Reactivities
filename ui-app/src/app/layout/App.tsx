import { observer } from "mobx-react-lite";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import InternalError from "../../features/errors/InternalError";
import HomePage from "../../features/home/HomePage";
import Login from "../../features/users/Login";
import { fontAwesomeConfig } from "../config/fontAwesomeConfig";
import { configurePrimeReact } from "../config/primeReactConfig";
import "../layout/styles/index.scss";
import "../layout/styles/layout.scss";
import { useStore } from "../stores/store";
import Navbar from "./Navbar";

const App = () => {
  configurePrimeReact();
  fontAwesomeConfig();
  const location = useLocation();
  const { commonStore, userStore } = useStore();
  useEffect(() => {
    if (commonStore.token) {
      userStore.getCurrentUser();
    }
  }, [commonStore, userStore]);

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
          <Login />
        </>
      );
    }

    return (
      <>
        <Navbar />
        <div className="layout-main-container">
          <div className="layout-main">
            {/* <div
              className={
                !sideBarCollapsed
                  ? "layout-sidebar layout-sidebar-open offset-2"
                  : "layout-sidebar layout-sidebar-closed offset-1"
              }
            >
              <Outlet />
            </div> */}
            <Outlet />
          </div>
        </div>
      </>
    );
  };

  return <div className="layout-wrapper layout-static">{renderApp()}</div>;
};

export default observer(App);
