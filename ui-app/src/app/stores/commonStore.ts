import { makeAutoObservable } from "mobx";
import { ServerError } from "../interfaces/serverError";

export default class CommonStore {
  error: ServerError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setError = (error: any) => {
    this.error = error;
  };
}
