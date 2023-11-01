import { Toast, ToastMessage } from "primereact/toast"
import { ReactNode, RefObject } from "react"

export default abstract class BaseStore {
  private toastRef?: RefObject<Toast>

  private readonly ToastMessageProps: ToastMessage = {
    severity: "info",
    className: "p-toast-container",
  }

  setToastRef = (toastRef: RefObject<Toast>) => {
    this.toastRef = toastRef
  }

  infoNotif = (message: string | ReactNode, content?: string | ReactNode) => {
    if (content) {
      this.toastRef?.current?.show({ ...this.ToastMessageProps, content: content })
    }
    this.toastRef?.current?.show({ ...this.ToastMessageProps, detail: message, summary: "Information" })
  }

  successNotif = (message: string | ReactNode, content?: string | ReactNode) => {
    if (content) {
      this.toastRef?.current?.show({ ...this.ToastMessageProps, severity: "success", content: content })
    }
    this.toastRef?.current?.show({
      ...this.ToastMessageProps,
      severity: "success",
      summary: "Success",
      detail: message,
    })
  }

  warningNotif = (message: string | ReactNode, content?: string | ReactNode) => {
    if (content) {
      this.toastRef?.current?.show({ ...this.ToastMessageProps, severity: "warn", content: content })
    }
    this.toastRef?.current?.show({ ...this.ToastMessageProps, severity: "warn", detail: message, summary: "Warning" })
  }

  errorNotif = (message: string | ReactNode, content?: string | ReactNode) => {
    if (content) {
      this.toastRef?.current?.show({ ...this.ToastMessageProps, severity: "error", content: content })
    }
    this.toastRef?.current?.show({
      ...this.ToastMessageProps,
      severity: "error",
      detail: message,
      summary: "Something went wrong",
    })
  }

  customNotif = (props: ToastMessage) => {
    this.toastRef?.current?.show(props)
  }
}
