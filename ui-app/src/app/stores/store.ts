import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import AppStore from "./appStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";

interface Store {
  activityStore: ActivityStore;
  appStore: AppStore;
  commonStore: CommonStore;
  userStore: UserStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  appStore: new AppStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
