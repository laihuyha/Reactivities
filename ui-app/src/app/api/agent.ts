import axios, { AxiosError, AxiosResponse } from "axios";
import AppStore from "../stores/appStore";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

axios.defaults.baseURL = process.env.REACT_APP_API;

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response!;
    const { details, message } = data as any;
    switch (status) {
      case 400:
        AppStore.notify?.error(`Oops! Bad Request, Message: ${message}`);
        console.log("Details: ", details);
        break;
      case 401:
        AppStore.notify?.error("Unauthorized!");
        break;
      case 403:
        AppStore.notify?.error("Forbidden!");
        break;
      case 404:
        AppStore.notify?.error("Not Found!");
        break;
      case 500:
        AppStore.notify?.error(`Internal Server Error!, Message: ${message}`);
        console.log("Details: ", details);
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
