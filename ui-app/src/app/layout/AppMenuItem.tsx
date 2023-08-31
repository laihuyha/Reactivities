import { Link } from "react-router-dom";
import { AppMenuItemProps } from "../../types/layout";
import { Ripple } from "primereact/ripple";
import { CSSTransition } from "react-transition-group";

const AppMenuItem = (props: AppMenuItemProps) => {
  const item = props.item;
  const key = props.parentKey ? props.parentKey + "-" + props.index : String(props.index);

  const subMenu = item!.items && item!.visible !== false && (
    <CSSTransition
      timeout={{ enter: 1000, exit: 450 }}
      classNames="layout-submenu"
      in={props.root ? true : undefined}
      key={item!.label}
    >
      <ul>
        {item!.items.map((child, i) => {
          return <AppMenuItem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />;
        })}
      </ul>
    </CSSTransition>
  );

  return (
    <>
      <li>
        {props.root && item!.visible !== false && <div className="layout-menuitem-root-text">{item!.label}</div>}
        {(!item!.to || item!.items) && item!.visible !== false ? (
          <a href={item!.url} onClick={() => {}} className={"p-ripple"} target={item!.target} tabIndex={0}>
            <i className={""}></i>
            <span className="layout-menuitem-text">{item!.label}</span>
            {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
            <Ripple />
          </a>
        ) : null}

        {item!.to && !item!.items && item!.visible !== false ? (
          <Link to={item!.to} target={item!.target} onClick={() => {}} className={""} tabIndex={0}>
            <i className={""}></i>
            <span className="layout-menuitem-text">{item!.label}</span>
            {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
            <Ripple />
          </Link>
        ) : null}
        {subMenu}
      </li>
    </>
  );
};

export default AppMenuItem;
