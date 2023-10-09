import ReactDOM from "react-dom/client";
import { StoreContext, store, useStore } from "./app/stores/store";
import { RouterProvider } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import router from "./app/router/route";
import "./app/layout/styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const RenderedApp = () => {
  const toast = useRef<Toast>(null);

  const { notif } = useStore();

  useEffect(() => {
    if (!notif.toastRef) {
      notif.initToastRef(toast);
    }
  }, [notif, toast]);

  return (
    <>
      <StoreContext.Provider value={store}>
        <Toast ref={toast} />
        <RouterProvider router={router}></RouterProvider>
      </StoreContext.Provider>
      ;
    </>
  );
};

root.render(<RenderedApp />);
