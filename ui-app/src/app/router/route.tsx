import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      {
        path: "activities",
        lazy: async () => {
          const { default: ActivitiesDashboardComponent } = await import(
            "../../features/activities/dashboard/ActivitiesDashBoard"
          );
          return { Component: ActivitiesDashboardComponent };
        },
      },
      {
        path: "createActivity",
        lazy: async () => {
          const { default: ActivityFormComponent } = await import("../../features/activities/form/ActivityForm");
          return { Component: ActivityFormComponent };
        },
      },
      {
        path: "activity/:id",
        loader: async ({ params }) => {
          return params.id;
        },
        lazy: async () => {
          const { default: ActivityDetailsComponent } = await import(
            "../../features/activities/details/ActivityDetails"
          );
          return { Component: ActivityDetailsComponent };
        },
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
