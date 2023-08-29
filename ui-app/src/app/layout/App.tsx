import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../layout/styles/index.scss";
import Navbar from "./Navbar";
import HomePage from "../../features/home/HomePage";
import { configurePrimeReact } from "../config/primeReactConfig";
import { fontAwesomeConfig } from "../config/fontAwesomeConfig";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import InternalError from "../../features/errors/InternalError";
import Login from "../../features/users/Login";

const App = () => {
  configurePrimeReact();
  fontAwesomeConfig();
  const location = useLocation();

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
            <Outlet />
          </div>
        </div>
      </>
    );
  };

  return <div className="layout-wrapper layout-static">{renderApp()}</div>;
};

export default observer(App);
