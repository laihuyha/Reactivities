import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { useStore } from "../stores/store";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const { activityStore } = useStore();
  const { setIsCreate, initFormData } = activityStore;
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
      url: "/activities",
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
