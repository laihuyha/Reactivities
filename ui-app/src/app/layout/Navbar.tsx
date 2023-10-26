import { Menubar } from "primereact/menubar"
import { MenuItem } from "primereact/menuitem"
import { useStore } from "../stores/store"
import { NavLink, useLocation } from "react-router-dom"
import { Button } from "primereact/button"
import { Menu } from "primereact/menu"
import { useRef } from "react"
import "./styles/index.scss"
import router from "../router/route"
import { Avatar } from "primereact/avatar"

const Navbar = () => {
  const { activityStore, userStore } = useStore()
  const { setIsCreate, initFormData } = activityStore
  const { isLogin, user } = userStore
  const location = useLocation()
  const menuLeft = useRef<Menu>(null)

  const start = (
    <NavLink
      to={"/"}
      // eslint-disable-next-line react/no-children-prop
      children={
        <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2" />
      }
    />
  )

  const userMenuItem = [
    {
      label: "Account",
      icon: "pi pi-fw pi-user",
    },
    {
      label: "Log Out",
      icon: "pi pi-fw pi-sign-out",
    },
  ]

  const userMenu = (
    <Button
      onClick={(event) => menuLeft?.current?.toggle(event)}
      aria-controls="popup_menu_right"
      aria-haspopup
      style={{
        fontSize: "0.75rem",
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    >
      <Avatar image={user?.image ?? ""} className="mr-2" shape="circle" />
      <div className="flex flex-column align">
        <span className="font-bold">{user?.displayName}</span>
        <span className="text-sm">{user?.username}</span>
      </div>
    </Button>
  )

  const end = isLogin ? userMenu : <></>

  const items: MenuItem[] = [
    {
      label: "Activities",
      style: { borderRadius: 5 },
      command: () => {
        router.navigate("/activities")
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
              setIsCreate(true)
              initFormData()
            },
          }),
    },
  ]

  return (
    <>
      <Menu model={userMenuItem} popup ref={menuLeft} id="popup_menu_left" popupAlignment="left" />
      <Menubar className="layout-topbar" model={items} start={start} end={end} />;
    </>
  )
}
export default Navbar
