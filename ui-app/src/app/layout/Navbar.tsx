import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { useStore } from "../stores/store";
import { NavLink, useLocation } from "react-router-dom";
import "./styles/index.scss";
import router from "../router/route";
// import { Menu } from "primereact/menu";
// import { classNames } from "primereact/utils";
// import { Avatar } from "primereact/avatar";

const Navbar = () => {
  const { activityStore, userStore } = useStore();
  const { setIsCreate, initFormData } = activityStore;
  const { isLogin } = userStore;
  const location = useLocation();

  const start = (
    <NavLink
      to={"/"}
      children={
        <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2" />
      }
    />
  );

  // let userMenuItems: MenuItem[] = [
  //   { label: "Profile", icon: "pi pi-fw pi-user" },
  //   { label: "Settings", icon: "pi pi-fw pi-cog" },
  //   { separator: true },
  //   {
  //     command: () => {},
  //     template: (item, options) => {
  //       console.log(item);
  //       return (
  //         <button
  //           onClick={(e) => options.onClick(e)}
  //           className={classNames(
  //             options.className,
  //             "w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
  //           )}
  //         >
  //           <Avatar
  //             image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
  //             className="mr-2"
  //             shape="circle"
  //           />
  //           <div className="flex flex-column align">
  //             <span className="font-bold">Amy Elsner</span>
  //             <span className="text-sm">Agent</span>
  //           </div>
  //         </button>
  //       );
  //     },
  //   },
  // ];

  // const userMenu = (
  //   <Menu
  //     model={userMenuItems}
  //     appendTo={"self"}
  //     style={{
  //       marginTop: "20vh",
  //     }}
  //   />
  // );

  const end = isLogin ? <></> : <></>;

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
    // {
    //   label: "show sidebar",
    //   command: () => {
    //     setSideBarCollapseState(true);
    //   },
    // },
  ];

  return <Menubar className="layout-topbar" model={items} start={start} end={end} />;
};
export default Navbar;
