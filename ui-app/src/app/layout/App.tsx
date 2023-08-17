import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../layout/styles/index.scss";
import Navbar from "./Navbar";
import LoadingComponent from "./LoadingComponent";
// import HomePage from "../../features/home/HomePage";
import NotFound from "../../features/errors/NotFound";
import { configurePrimeReact } from "../config/primeReactConfig";
import { fontAwesomeConfig } from "../config/fontAwesomeConfig";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { Suspense, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Outlet, useLocation } from "react-router-dom";

const App = () => {
  configurePrimeReact();
  fontAwesomeConfig();
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
    <div
      className="App flex flex-column align-content-center justify-content-center h-screen"
      style={{ position: "relative" }}
    >
      <Toast ref={toast} />
      {location.pathname === "/" && !appLoading ? (
        // <HomePage />
        <NotFound />
      ) : (
        <>
          <Navbar />
          <Suspense fallback={<LoadingComponent />}>
            <Outlet />
          </Suspense>
        </>
      )}
    </div>
  );
};

export default observer(App);
