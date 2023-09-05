import { observer } from "mobx-react-lite";
import { AppMenuItemProps } from "../../types/layout";
import { CSSTransition } from "react-transition-group";
import { classNames } from "primereact/utils";
import { Ripple } from "primereact/ripple";
import { Link } from "react-router-dom";

const AppMenuitem = observer((props: AppMenuItemProps) => {
  const item = props.items;
  const subMenu = item!.items && item!.visible !== false && (
    <CSSTransition
      timeout={{ enter: 1000, exit: 450 }}
      classNames="layout-submenu"
      in={props.root ? true : false}
      key={item!.label}
    >
      <ul>
        {item!.items.map((child, i) => {
          return <AppMenuitem items={child} index={i} className={""} parentKey={""} key={child.label} />;
        })}
      </ul>
    </CSSTransition>
  );
  const itemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    //avoid processing disabled items
    if (item!.disabled) {
      event.preventDefault();
      return;
    }

    //execute command
    if (item!.command) {
      item!.command({ originalEvent: event, item: item });
    }

    // // toggle active state
    // if (item!.items) setActiveMenu(active ? (props.parentKey as string) : key);
    // else setActiveMenu(key);
  };
  return (
    <li className={classNames({ "layout-root-menuitem": props.root, "active-menuitem": "menuitem" })}>
      {props.root && item!.visible !== false && <div className="layout-menuitem-root-text">{item!.label}</div>}
      {(!item!.to || item!.items) && item!.visible !== false ? (
        <a
          href={item!.url}
          onClick={(e) => itemClick(e)}
          className={classNames(item!.className, "p-ripple")}
          target={item!.target}
          tabIndex={0}
        >
          <i className={classNames("layout-menuitem-icon", item!.icon)}></i>
          <span className="layout-menuitem-text">{item!.label}</span>
          {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
          <Ripple />
        </a>
      ) : null}

      {item!.to && !item!.items && item!.visible !== false ? (
        <Link
          to={item!.to}
          target={item!.target}
          onClick={(e) => itemClick(e)}
          className={classNames(item!.className, "p-ripple")}
          tabIndex={0}
        >
          <i className={classNames("layout-menuitem-icon", item!.icon)}></i>
          <span className="layout-menuitem-text">{item!.label}</span>
          {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
          <Ripple />
        </Link>
      ) : null}

      {subMenu}
    </li>
  );
});

export default AppMenuitem;
