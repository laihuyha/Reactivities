import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../layout/index.scss";
import { useEffect, useState } from "react";
import { configurePrimeReact } from "../config/primeReactConfig";
import axios from "axios";
import Activity from "../models/activity";
import Navbar from "./Navbar";
import ActivitiesDashBoard from "../../features/activities/dashboard/ActivitiesDashBoard";

const App = () => {
  configurePrimeReact();

  const [activities, setListActivities] = useState<Activity[]>([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/Activities`).then((res) => {
      setListActivities(res.data);
    });
  }, []);

  return (
    <div className="App">
      <Navbar />
      <ActivitiesDashBoard activities={activities} />
    </div>
  );
};

export default App;
