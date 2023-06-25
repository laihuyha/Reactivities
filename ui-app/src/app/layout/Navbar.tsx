import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";

const Navbar = () => {
  const start = (
    <img
      alt="logo"
      src="https://primefaces.org/cdn/primereact/images/logo.png"
      height="40"
      className="mr-2"
    ></img>
  );

  const end = <InputText placeholder="Search" type="text" />;

  const items: MenuItem[] = [
    {
      label: "Activities",
      style: { borderRadius: 5 },
      url: "",
    },
    {
      label: "Create Activity",
      style: {
        backgroundColor: "var(--green-400)",
      },
      url: "",
    },
  ];

  return (
    <div className="card mb-3">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};
export default Navbar;
