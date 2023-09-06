import { Sidebar } from "primereact/sidebar";
import { AppMenuItem } from "../../types/layout";
import AppMenuitem from "./AppMenuitem";

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
      maskClassName="side-bar-bgmask layout-sidebar max-w-18rem"
      onHide={() => {
        props.setCollapsedState!(false);
      }}
      showCloseIcon={false}
      closeOnEscape={false}
    >
      <ul className="layout-menu">
        {props.children?.map((item, i) => (
          <AppMenuitem items={item} root={true} index={i} key={item.label} />
        ))}
      </ul>
    </Sidebar>
  );
};

export default SideBarMenu;
