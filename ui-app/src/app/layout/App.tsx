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

  return (
    <>
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <Navbar />
          <div className="flex flex-column max-h-screen">
            <Outlet />
            <Toast ref={toast} />
          </div>
        </>
      )}
    </>
  );
};

export default observer(App);
