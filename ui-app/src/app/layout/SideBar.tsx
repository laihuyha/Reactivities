import { AppMenuItem as MenuItem } from "../../types/layout";
import AppMenuItem from "./AppMenuItem";

interface SideBarMenuProps {
  children?: MenuItem[];
  className?: string;
}
// https://github.com/primefaces/sakai-react/blob/master/types/layout.d.ts#L88
// https://github.com/primefaces/sakai-react/blob/master/styles/layout/_menu.scss

const SideBarMenu = (props: SideBarMenuProps) => {
  return (
    <>
      <ul className="layout-menu">
        {props.children?.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuItem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </>
  );
};

export default SideBarMenu;
