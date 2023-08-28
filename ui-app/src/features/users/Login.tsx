import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Checkbox } from "primereact/checkbox";
import TextInput from "../../app/common/form/TextInput";
import * as yup from "yup";
import PasswordInput from "../../app/common/form/PasswordInput";
import { useStore } from "../../app/stores/store";
import { Button } from "primereact/button";

const Login = () => {
  const { userStore } = useStore();
  const { login } = userStore;
  const validationSchema = yup.object({
    username: yup.string().required("UserName is required"),
    password: yup.string().required("Password is required"),
  });
  return (
    <>
      <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{ username: "", password: "", remember: false }}
          onSubmit={async (values) => {
            await login(values);
          }}
        >
          {({ handleSubmit, setFieldValue, values, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="flex flex-column align-items-center justify-content-center">
              <div
                style={{
                  borderRadius: "56px",
                  padding: "0.3rem",
                  background: "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
                }}
              >
                <div
                  className="w-full surface-card py-8 px-5 sm:px-8"
                  style={{
                    borderRadius: "53px",
                  }}
                >
                  <div className="text-center mb-5">
                    <div className="text-900 text-3xl font-medium mb-3">Welcome</div>
                    <span className="text-600 font-medium">Sign in to continue</span>
                  </div>
                  <div>
                    <label className="block text-900 text-xl font-medium mb-2">User Name</label>
                    <TextInput
                      name="username"
                      placeholder="User Name"
                      className="p-inputtext p-component w-full md:w-30rem mb-2 w-full md:w-30rem mb-3"
                      type="text"
                    />
                    <label className="block text-900 font-medium text-xl mb-2">Password</label>
                    <PasswordInput
                      className="p-password p-component p-inputwrapper p-input-icon-right w-full mb-3"
                      name="password"
                      placeholder="Password"
                      feedback={false}
                    />
                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                      <div className="flex align-items-center">
                        <Checkbox
                          className="mr-2"
                          onChange={(e) => setFieldValue("remember", e.target.checked)}
                          checked={values.remember}
                        ></Checkbox>
                        <label>Remember me</label>
                      </div>
                      {/* <a
                        href="#"
                        className="font-medium no-underline ml-2 text-right cursor-pointer"
                        style={{
                          color: "var(--primary-color)",
                        }}
                      >
                        Forgot password?
                      </a> */}
                    </div>
                    <Button
                      aria-label="Sign In"
                      className="p-button p-component w-full p-3 text-xl fluid"
                      type="submit"
                      loading={isSubmitting}
                    >
                      <span className="p-button-label p-c" data-pc-section="label">
                        Sign In
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default observer(Login);
