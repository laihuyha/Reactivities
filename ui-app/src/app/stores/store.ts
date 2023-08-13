import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import AppStore from "./appStore";

interface Store {
  activityStore: ActivityStore;
  appStore: AppStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  appStore: new AppStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
