import { makeAutoObservable } from "mobx"
import { ServerError } from "../interfaces/serverError"

export default class CommonStore {
  error: ServerError | null = null
  token?: string

  constructor() {
    makeAutoObservable(this)
  }

  setError = (error: any) => {
    this.error = error
  }

  setTokenString = (token?: string) => {
    if (token) {
      localStorage.setItem("token", token)
      this.token = token
      return
    }

    localStorage.removeItem("token")
    this.token = undefined
  }
}
