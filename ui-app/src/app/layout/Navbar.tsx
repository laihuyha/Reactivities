import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { useStore } from "../stores/store";
import { NavLink, useLocation } from "react-router-dom";
import "./styles/index.scss";
import router from "../router/route";

const Navbar = () => {
  const { activityStore, appStore } = useStore();
  const { setIsCreate, initFormData } = activityStore;
  const { setSideBarCollapseState } = appStore;
  const location = useLocation();

  const start = (
    <NavLink
      to={"/"}
      children={
        <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2" />
      }
    />
  );

  const end = <InputText placeholder="Search" type="text" />;

  const items: MenuItem[] = [
    {
      label: "Activities",
      style: { borderRadius: 5 },
      command: () => {
        router.navigate("/activities");
      },
    },
    {
      label: "Create Activity",
      style: {
        backgroundColor: "var(--green-400)",
      },
      ...(location.pathname === "/"
        ? { url: "createActivity" }
        : {
            command: () => {
              setIsCreate(true);
              initFormData();
            },
          }),
    },
    {
      label: "show sidebar",
      command: () => {
        setSideBarCollapseState(true);
      },
    },
  ];

  return <Menubar className="layout-topbar" model={items} start={start} end={end} />;
};
export default Navbar;
