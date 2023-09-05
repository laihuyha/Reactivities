import { Sidebar } from "primereact/sidebar";
import { AppMenuItem } from "../../types/layout";
import { Menu } from "primereact/menu";

interface SideBarMenuProps {
  children?: AppMenuItem[];
  className?: string;
  isShow?: boolean;
  setIsShow?: (isShow: boolean) => void;
}

type RequiredSetIsShowIfIsShow = {
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
};

type OptionalIsShowAndSetIsShow = {
  isShow?: undefined;
  setIsShow?: undefined;
};

type PropsCondition = RequiredSetIsShowIfIsShow | OptionalIsShowAndSetIsShow;

// const recursiveChildren = (children?: AppMenuItem[]) => {
//   if (!children) return [];
//   return children.reduce((acc, child) => {
//     if (child.items) {
//       acc.push(...recursiveChildren(child.items));
//     } else {
//       acc.push(child);
//     }
//     return acc;
//   }, [] as AppMenuItem[]);
// };

const SideBarMenu = (props: PropsCondition & SideBarMenuProps) => {
  // const items = recursiveChildren(props.children);
  const items = props.children;
  return (
    <Sidebar
      visible={props.isShow}
      onHide={() => (props.isShow ? props.setIsShow(false) : undefined)}
      maskClassName="side-bar-bgmask layout-sidebar"
    >
      <Menu model={items} className="sidebar-menu-item w-full" />
    </Sidebar>
  );
};

export default SideBarMenu;
