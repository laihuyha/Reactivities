import { Toast, ToastMessage } from "primereact/toast";
import { ReactNode, RefObject } from "react";

export interface ToastSetUp {
  toastRef?: RefObject<Toast>;
  setUpToast?: () => void;
}

export default class Notify {
  private toastRef?: RefObject<Toast>;

  private readonly ToastMessageProps: ToastMessage = {
    severity: "info",
    className: "p-toast-container",
  };

  constructor(toastRef: RefObject<Toast>) {
    this.initToastRef(toastRef);
  }

  initToastRef = (toastRef: RefObject<Toast>) => {
    this.toastRef = toastRef;
  };

  info = (message: string | ReactNode, content?: string | ReactNode) => {
    if (content) {
      this.toastRef?.current?.show({ ...this.ToastMessageProps, content: content });
    }
    this.toastRef?.current?.show({ ...this.ToastMessageProps, detail: message, summary: "Information" });
  };

  success = (message: string | ReactNode, content?: string | ReactNode) => {
    if (content) {
      this.toastRef?.current?.show({ ...this.ToastMessageProps, severity: "success", content: content });
    }
    this.toastRef?.current?.show({
      ...this.ToastMessageProps,
      severity: "success",
      summary: "Success",
      detail: message,
    });
  };

  warning = (message: string | ReactNode, content?: string | ReactNode) => {
    if (content) {
      this.toastRef?.current?.show({ ...this.ToastMessageProps, severity: "warn", content: content });
    }
    this.toastRef?.current?.show({ ...this.ToastMessageProps, severity: "warn", detail: message, summary: "Warning" });
  };

  error = (message: string | ReactNode, content?: string | ReactNode) => {
    if (content) {
      this.toastRef?.current?.show({ ...this.ToastMessageProps, severity: "error", content: content });
    }
    this.toastRef?.current?.show({
      ...this.ToastMessageProps,
      severity: "error",
      detail: message,
      summary: "Something went wrong",
    });
  };

  custom = (props: ToastMessage) => {
    this.toastRef?.current?.show(props);
  };
}
