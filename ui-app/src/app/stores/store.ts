import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import AppStore from "./appStore";
import CommonStore from "./commonStore";

interface Store {
  activityStore: ActivityStore;
  appStore: AppStore;
  commonStore: CommonStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  appStore: new AppStore(),
  commonStore: new CommonStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
