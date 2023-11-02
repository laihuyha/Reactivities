import { makeAutoObservable, runInAction } from "mobx";
import { LoginDTO, User, UserFormValues } from "../models/user";
import AccountServices from "../api/services/accountServices";
import { store } from "./store";
import router from "../router/route";

export default class UserStore {
  user: User | null = null;
  isVisibleRegisterForm = false;
  constructor() {
    makeAutoObservable(this);
  }

  get isLogin() {
    return !!this.user;
  }

  login = async (creds: LoginDTO) => {
    const user = await AccountServices.login(creds);
    if (user) {
      runInAction(() => {
        this.user = user;
        store.commonStore.setTokenString(user.token);
        router.navigate("/activities");
      });
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      const user = await AccountServices.register(creds);
      store.commonStore.setTokenString(user.token);
      runInAction(() => {
        this.user = user;
        router.navigate("/activities");
      });
      this.setIsVisibleRegisterForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  logout = () => {
    store.commonStore.setTokenString(null);
    this.user = null;
    router.navigate("/");
  };

  setIsVisibleRegisterForm = (value: boolean) => {
    this.isVisibleRegisterForm = value;
  };

  getCurrentUser = async () => {
    try {
      const user = await AccountServices.getCurrent();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };
}
