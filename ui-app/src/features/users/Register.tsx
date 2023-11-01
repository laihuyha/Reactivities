import { observer } from "mobx-react-lite";
import { Dialog } from "primereact/dialog";
import { useStore } from "../../app/stores/store";
import { Steps } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";

const Register = () => {
  const { userStore } = useStore();
  const { isVisibleRegisterForm, setIsVisibleRegisterForm } = userStore;
  const items: MenuItem[] = [
    {
      label: "Personal Information",
    },
    {
      label: "Username and Password",
    },
  ];
  return (
    <Dialog
      visible={isVisibleRegisterForm}
      style={{ width: "50vw" }}
      onHide={() => setIsVisibleRegisterForm(false)}
      closeOnEscape={false}
      draggable={false}
    >
      <Steps model={items} children={[<>asdasdasd</>, <>238746283</>]} />
    </Dialog>
  );
};

export default observer(Register);
