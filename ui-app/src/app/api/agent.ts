import axios, { AxiosError, AxiosResponse } from "axios";
import AppStore from "../stores/appStore";
import router from "../router/route";
import { store } from "../stores/store";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

axios.defaults.baseURL = process.env.REACT_APP_API;

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          router.navigate("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          AppStore.notify?.error(data);
        }
        break;
      case 401:
        AppStore.notify?.error("Unauthorized!");
        break;
      case 403:
        AppStore.notify?.error("Forbidden!");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        store.commonStore.setError(data);
        router.navigate("/server-error");
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  patch: <T>(url: string, body: {}) => axios.patch<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

export default requests;
