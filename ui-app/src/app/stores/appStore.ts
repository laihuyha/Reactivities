import { makeAutoObservable } from "mobx"
// import Notify, { ToastSetUp } from "../../utils/notify";
// import { RefObject } from "react";
// import { Toast } from "primereact/toast";

// There 2 way to implement Toast
//#region : 1. Extend BaseStore and using makeObservable with alot of stuff to do here
// With this we are just using in Component can't be use in store or anywhere else
// export default class AppStore extends BaseStore {
//   appLoading: boolean = false;
//   constructor() {
//     super();
//     makeObservable(this, {
//       appLoading: observable,
//       setAppLoading: action,
//     });
//   }

//   setAppLoading = (loading: boolean) => {
//     this.appLoading = loading;
//   };
// }
//#endregion

//#region : 2. Using Notify class
// With this way we just need to initialize notify for once time then we can use it anywhere with AppStore.notify but with Toast has been rendered
// export default class AppStore implements ToastSetUp {
//   toastRef?: RefObject<Toast>;
//   appLoading: boolean = false;
//   static notify?: Notify;

//   constructor() {
//     makeAutoObservable(this);
//   }

//   setAppLoading = (loading: boolean) => {
//     this.appLoading = loading;
//   };

//   setToastRef = (toastRef: RefObject<Toast>) => {
//     this.toastRef = toastRef;
//   };

//   setUpToast = () => {
//     if (!AppStore.notify && this.toastRef) AppStore.notify = new Notify(this.toastRef);
//   };
// }
//#endregion

//#region : 3. Init Notify class inside Store at first
export default class AppStore {
  sideBarCollapsed: boolean = false
  constructor() {
    makeAutoObservable(this)
  }

  setSideBarCollapseState = (state: boolean) => {
    this.sideBarCollapsed = state
  }
}
