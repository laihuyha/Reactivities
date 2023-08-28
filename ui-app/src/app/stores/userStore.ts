import { makeAutoObservable, runInAction } from "mobx";
import { LoginDTO, User } from "../models/user";
import AccountServices from "../api/services/accountServices";

export default class UserStore {
  user: User | null = null;
  /**
   *
   */
  constructor() {
    makeAutoObservable(this);
  }

  get isLogin() {
    return !!this.user;
  }

  login = async (creds: LoginDTO) => {
    const user = await AccountServices.login(creds);
    runInAction(() => {
      this.user = user;
    });
  };
}
