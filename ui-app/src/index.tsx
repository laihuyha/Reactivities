import ReactDOM from "react-dom/client";
import { StoreContext, store } from "./app/stores/store";
import { RouterProvider } from "react-router-dom";
import router from "./app/router/route";
import "./app/layout/styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StoreContext.Provider value={store}>
    <RouterProvider router={router}></RouterProvider>
  </StoreContext.Provider>
);
