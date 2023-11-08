import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../interfaces/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem("token");

  constructor() {
    makeAutoObservable(this);

    // This reaction will run only when token changes
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
      }
    );
  }

  setError = (error: any) => {
    this.error = error;
  };

  setTokenString = (token: string | null) => {
    this.token = token;
  };
}
