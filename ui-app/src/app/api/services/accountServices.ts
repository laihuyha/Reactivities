import { LoginDTO, User, UserFormValues } from "../../models/user"
import requests from "../agent"

const AccountServices = {
  getCurrent: () => requests.get<User>("/account").then((response) => response),
  login: (user: LoginDTO) => requests.post<User>("/account/login", user).then((response) => response),
  register: (user: UserFormValues) => requests.post<User>("/account/Register", user).then((response) => response),
}

export default AccountServices
