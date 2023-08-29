import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

const InternalError = () => {
  const { commonStore } = useStore();
  const { error } = commonStore;
  return (
    <>
      <div className="flex flex-column justify-content-between min-h-screen align-items-center">
        <div className="flex flex-auto flex-column justify-content-center">
          <div
            style={{
              borderRadius: "56px",
              padding: "0.3rem",
              background: "linear-gradient(rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)",
            }}
          >
            <div
              className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
              style={{
                borderRadius: "53px",
              }}
            >
              <div
                className="flex justify-content-center align-items-center bg-pink-500 border-circle"
                style={{
                  height: "3.2rem",
                  width: "3.2rem",
                }}
              >
                <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
              </div>
              <h1 className="text-900 font-bold text-5xl mb-2">Error Occured</h1>
              <div className="text-600 mb-5">Something went wrong.</div>
              <div className="text-5xl font-bold">{error?.statusCode}</div>
              <div className="font-semibold">{error?.message}</div>
              {error?.details && (
                <div className="surface-ground mt-3 border-round">
                  <h3>Stack Trace</h3>
                  <code>{error?.details}</code>
                </div>
              )}
              <button aria-label="Go to Dashboard" className="p-button p-component p-button-text mt-2">
                <span className="p-button-icon p-c p-button-icon-left pi pi-arrow-left"></span>
                <span
                  className="p-button-label p-c"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  Go back
                </span>
                <span
                  role="presentation"
                  className="p-ink"
                  style={{
                    height: "169.453px",
                    width: "169.453px",
                  }}
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default observer(InternalError);
