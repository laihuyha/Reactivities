import { Sidebar } from "primereact/sidebar";
import { AppMenuItem } from "../../types/layout";
import AppMenuitem from "./AppMenuitem";

interface SideBarMenuProps {
  children?: AppMenuItem[];
  className?: string;
  isShow?: boolean;
  setIsShow?: (isShow: boolean) => void;
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

const recursiveChildren = (children?: AppMenuItem[]) => {
  if (!children) return [];
  return children.reduce((acc, child) => {
    if (child.items) {
      acc.push(...recursiveChildren(child.items));
    } else {
      let item = child;
      acc.push(item);
    }
    return acc;
  }, [] as AppMenuItem[]);
};

const SideBarMenu = (props: PropsCondition & SideBarMenuProps) => {
  // const items = recursiveChildren(props.children);
  //https://github.com/primefaces/sakai-react/blob/master/layout/AppMenu.tsx#L10
  //https://github.com/primefaces/sakai-react/blob/master/styles/layout/_mixins.scss
  const items = props.children;
  return (
    <Sidebar visible={true} maskClassName="side-bar-bgmask layout-sidebar" onHide={() => {}}>
      <ul className="layout-menu">
        {items?.map((item, i) => {
          return !item?.separator ? (
            <AppMenuitem items={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </Sidebar>
  );
};

export default SideBarMenu;
