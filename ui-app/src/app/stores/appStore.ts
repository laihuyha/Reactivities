import { action, makeObservable, observable } from "mobx";
import BaseStore from "./baseStore";

export default class AppStore extends BaseStore {
  appLoading: boolean = false;
  constructor() {
    super();
    makeObservable(this, {
      appLoading: observable,
      setAppLoading: action,
    });
  }

  setAppLoading = (loading: boolean) => {
    this.appLoading = loading;
  };
}
