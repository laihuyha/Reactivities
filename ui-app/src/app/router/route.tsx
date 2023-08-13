import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivitiesDashBoard from "../../features/activities/dashboard/ActivitiesDashBoard";
import ActivityForm from "../../features/activities/form/ActivityForm";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "activities", element: <ActivitiesDashBoard /> },
      { path: "createActivity", element: <ActivityForm /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
