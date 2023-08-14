import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../layout/styles/index.scss";
import Navbar from "./Navbar";
import LoadingComponent from "./LoadingComponent";
import { configurePrimeReact } from "../config/primeReactConfig";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";

const App = () => {
  configurePrimeReact();
  const { appStore } = useStore();
  const { appLoading } = appStore;
  const { setToastRef, setUpToast } = appStore;
  const toast = useRef<Toast>(null);
  const location = useLocation();

  useEffect(() => {
    setToastRef(toast);
    setUpToast();
  }, [appStore, setToastRef, setUpToast]);

  return (
    <div className="App" style={{ position: "relative" }}>
      <Toast ref={toast} />
      {location.pathname === "/" && !appLoading ? (
        <HomePage />
      ) : (
        <>
          <Navbar />
          {appLoading ? <LoadingComponent /> : <Outlet />}
        </>
      )}
    </div>
  );
};

export default observer(App);
