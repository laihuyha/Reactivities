import { Sidebar } from "primereact/sidebar";
import { AppMenuItem } from "../../types/layout";
import AppMenuitem from "./AppMenuitem";
import { Fragment } from "react";
import { ToggleButton } from "primereact/togglebutton";

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
      maskClassName={`side-bar-bgmask layout-sidebar ${props.isCollapsed ? "max-w-5rem" : "max-w-16rem"}`}
      onHide={() => props.setCollapsedState!(false)}
      showCloseIcon={false}
      closeOnEscape={false}
      header={[
        <Fragment key={"toggle-collapsed"}>
          <ToggleButton
            offLabel=""
            onLabel=""
            onIcon="pi pi-arrow-circle-right"
            offIcon="pi pi-arrow-circle-left"
            checked={props.isCollapsed ?? true}
            onChange={(e) => {
              props.setCollapsedState && props.setCollapsedState(e.value ? e.value : false);
            }}
            style={{
              position: "absolute",
              top: 0,
              right: "-2rem",
              width: "2rem",
              height: "1rem",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              boxShadow: "none",
            }}
          />
        </Fragment>,
      ]}
      style={{
        transition: "ease-in-out 0.2s",
        position: "relative",
      }}
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
  );
};

export default SideBarMenu;
