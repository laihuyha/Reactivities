import { Sidebar } from "primereact/sidebar"
import { AppMenuItem } from "../../types/layout"
import { Fragment } from "react"
import { ToggleButton } from "primereact/togglebutton"
import AppMenuitem from "./AppMenuitem"

interface SideBarMenuProps {
  children?: AppMenuItem[];
  className?: string;
}

type RequiredSetIsShowIfIsShow = {
  isCollapsed: boolean;
  setCollapsedState: (isShow: boolean) => void;
};

type OptionalIsShowAndSetIsShow = {
  isCollapsed?: undefined;
  setCollapsedState?: undefined;
};

type PropsCondition = RequiredSetIsShowIfIsShow | OptionalIsShowAndSetIsShow;

const SideBarMenu = (props: PropsCondition & SideBarMenuProps) => {
  // const items = recursiveChildren(props.children);
  //https://github.com/primefaces/sakai-react/blob/master/layout/AppMenu.tsx#L10
  //https://github.com/primefaces/sakai-react/blob/master/styles/layout/_mixins.scss
  return (
    <Sidebar
      visible={true}
      maskClassName={`side-bar-bgmask layout-sidebar ${props.isCollapsed ? "max-w-4rem" : "max-w-16rem"}`}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onHide={() => props.setCollapsedState!(false)}
      showCloseIcon={false}
      closeOnEscape={false}
      header={[
        <Fragment key={"toggle-collapsed"}>
          <ToggleButton
            id="sidebar-toggle-btn"
            offLabel=""
            onLabel=""
            onIcon="pi pi-arrow-circle-right"
            offIcon="pi pi-arrow-circle-left"
            checked={props.isCollapsed ?? true}
            onChange={(e) => {
              props.setCollapsedState && props.setCollapsedState(e.value ? e.value : false)
            }}
          />
        </Fragment>,
      ]}
      style={{
        transition: "ease-in-out 0.2s",
        position: "relative",
      }}
      // eslint-disable-next-line react/no-children-prop
      children={
        props.isCollapsed ? (
          <></>
        ) : (
          <ul className="layout-menu">
            {props.children?.map((item, i) => (
              <AppMenuitem items={item} root={true} index={i} key={item.label} />
            ))}
          </ul>
        )
      }
    />
  )
}

export default SideBarMenu
