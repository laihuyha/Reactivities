import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../layout/styles/index.scss";
import { useEffect, useState } from "react";
import { configurePrimeReact } from "../config/primeReactConfig";
import Activity from "../models/activity";
import Navbar from "./Navbar";
import ActivitiesDashBoard from "../../features/activities/dashboard/ActivitiesDashBoard";
import ActivityServices from "../api/services/activities";
import LoadingComponent from "./LoadingComponent";
// import { v4 as uuid } from "uuid";

const App = () => {
  configurePrimeReact();

  const [activities, setListActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ActivityServices.list().then((response) => {
      setListActivities(response);
    });
    setLoading(false);
  }, []);

  return (
    <div className="App">
      <Navbar />
      {loading ? (
        <LoadingComponent />
      ) : (
        <ActivitiesDashBoard activities={activities} />
      )}
    </div>
  );
};

export default App;
