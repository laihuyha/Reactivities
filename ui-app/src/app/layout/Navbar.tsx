import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { useStore } from "../stores/store";

const Navbar = () => {
  const { activityStore, appStore } = useStore();
  const { setIsCreate, initFormData } = activityStore;
  const start = (
    <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>
  );

  const end = <InputText placeholder="Search" type="text" />;

  const items: MenuItem[] = [
    {
      label: "Activities",
      style: { borderRadius: 5 },
      url: "",
      command: () => {
        appStore.infoNotif("Test Notif");
      },
    },
    {
      label: "Create Activity",
      style: {
        backgroundColor: "var(--green-400)",
      },
      url: "",
      command: () => {
        initFormData();
        setIsCreate(true);
      },
    },
  ];

  return (
    <div
      className="card mb-3"
      style={{
        position: "sticky",
        top: 0,
      }}
    >
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};
export default Navbar;
