/* eslint-disable react/no-children-prop */
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Formik } from "formik";
import * as yup from "yup";
import { Dialog } from "primereact/dialog";
import TextInput from "../../app/common/form/TextInput";
import PasswordInput from "../../app/common/form/PasswordInput";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

const Register = () => {
  const { userStore } = useStore();
  const { isVisibleRegisterForm, setIsVisibleRegisterForm, register } = userStore;
  const validationSchema = yup.object({
    username: yup.string().required("UserName is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$/,
        "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, and one number"
      ),
    email: yup.string().required("Email is required").email(),
    displayName: yup.string().required("Display Name is required"),
  });

  return (
    <>
      <Dialog
        visible={isVisibleRegisterForm}
        onHide={() => setIsVisibleRegisterForm(false)}
        closeIcon={<></>}
        closeOnEscape={false}
        draggable={false}
        header={
          <div className="justify-content-center align-items-center align-content-center text-center text-2xl">
            Register
          </div>
        }
        style={{
          width: "28vw",
        }}
      >
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{ username: "", password: "", email: "", displayName: "" }}
          onSubmit={async (values) => {
            await register(values);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form
              onSubmit={handleSubmit}
              className="flex flex-column align-items-center justify-content-center align-content-center"
            >
              <div className="w-full surface-card">
                <label className="block text-900 text-xl font-medium mb-2">Email</label>
                <TextInput
                  name="email"
                  placeholder="Email"
                  className="p-inputtext p-component w-full md:w-30rem mb-2 w-full md:w-30rem mb-3"
                  type="text"
                />
                <label className="block text-900 text-xl font-medium mb-2">Display Name</label>
                <TextInput
                  name="displayName"
                  placeholder="Display Name"
                  className="p-inputtext p-component w-full md:w-30rem mb-2 w-full md:w-30rem mb-3"
                  type="text"
                />
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
                <Divider></Divider>
                <div className="justify-content-center text-center">
                  <Button aria-label="Register" className="p-button text-xl fluid" type="submit" loading={isSubmitting}>
                    <span className="p-button-label p-c" data-pc-section="label">
                      Register
                    </span>
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default observer(Register);
