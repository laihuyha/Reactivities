import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../layout/styles/index.scss";
import Navbar from "./Navbar";
import ActivitiesDashBoard from "../../features/activities/dashboard/ActivitiesDashBoard";
import LoadingComponent from "./LoadingComponent";
import { configurePrimeReact } from "../config/primeReactConfig";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";

const App = () => {
  configurePrimeReact();
  const { appStore } = useStore();
  const { appLoading } = appStore;
  const { setToastRef, setUpToast } = appStore;
  const toast = useRef<Toast>(null);

  useEffect(() => {
    setToastRef(toast);
    setUpToast();
    // AppStore.notify?.infoNotif("Welcome to Reactivities");
  }, [appStore, setToastRef, setUpToast]);

  return (
    <div className="App" style={{ position: "relative" }}>
      <Toast ref={toast} />
      <Navbar />
      {appLoading ? <LoadingComponent /> : <ActivitiesDashBoard />}
    </div>
  );
};

export default observer(App);
