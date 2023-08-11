import Activity from "../../models/activity";
import requests from "../agent";

const ActivityServices = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: number) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post("/activities", activity),
  update: (activity: Activity) => requests.put(`/activities/${activity.id}`, activity),
  delete: (id: number) => requests.delete(`/activities/${id}`),
};

export default ActivityServices;
