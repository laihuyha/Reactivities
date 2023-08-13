import Activity from "../../models/activity";
import requests from "../agent";

const ActivityServices = {
  list: () =>
    requests.get<Activity[]>("/activities").then((listActivities) => {
      return listActivities;
    }),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`).then((activity) => activity),
  create: (activity: Activity) => requests.post("/activities", activity).then((response) => response),
  update: (activity: Activity) => requests.put(`/activities/${activity.id}`, activity).then((response) => response),
  delete: (id: string) => requests.delete(`/activities/${id}`).then((response) => response),
};

export default ActivityServices;
