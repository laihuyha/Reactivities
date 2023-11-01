import { MenuItem } from "primereact/menuitem"

/* AppMenu Types */
type CommandProps = {
  originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
  item: any;
};

export interface AppMenuItem extends MenuItem {
  to?: string;
  command?: ({ originalEvent, item }: CommandProps) => void;
  items?: AppMenuItem[];
}

export interface AppMenuItemProps {
  items?: AppMenuItem;
  parentKey?: string;
  index?: number;
  root?: boolean;
  className?: string;
}
