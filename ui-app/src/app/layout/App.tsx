import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../layout/styles/index.scss";
// import Navbar from "./Navbar";
import HomePage from "../../features/home/HomePage";
import InternalError from "../../features/errors/InternalError";
import Login from "../../features/users/Login";
import SideBarMenu from "./SideBar";
import { configurePrimeReact } from "../config/primeReactConfig";
import { fontAwesomeConfig } from "../config/fontAwesomeConfig";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import { AppMenuItem } from "../../types/layout";
import { useStore } from "../stores/store";

const App = () => {
  configurePrimeReact();
  fontAwesomeConfig();
  const location = useLocation();
  const { appStore } = useStore();
  const { sideBarShow, setSideBarShowState } = appStore;

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

    const item: AppMenuItem[] = [
      { label: "Home", to: "/" },
      {
        label: "Activities",
        to: "/activities",
      },
      {
        label: "Create Activity",
        to: "/createActivity",
      },
      {
        label: "Test",
        items: [
          {
            label: "Test1",
            items: [{ label: "Test1-1" }, { label: "Test1-2" }],
          },
          {
            label: "Test2",
            items: [{ label: "Test2-1" }, { label: "Test2-2" }],
          },
        ],
      },
    ];

    return (
      <>
        {/* <Navbar /> */}
        <div className="layout-main-container">
          <div className="layout-main">
            <SideBarMenu children={item} isShow={sideBarShow} setIsShow={setSideBarShowState} />
            <div
              className={
                sideBarShow ? "layout-sidebar layout-sidebar-open col-offset-2" : "layout-sidebar layout-sidebar-closed"
              }
            >
              <Outlet />
            </div>
          </div>
        </div>
      </>
    );
  };

  return <div className="layout-wrapper layout-static">{renderApp()}</div>;
};

export default observer(App);
