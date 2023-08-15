import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { NavLink } from "react-router-dom";
import { useRef, useState } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { MenuItem } from "primereact/menuitem";
import { useStore } from "../../../app/stores/store";
import { ContextMenu } from "primereact/contextmenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import Activity from "../../../app/models/activity";

interface Props {
  activity: Activity;
}

const ActitvityItem = ({ activity }: Props) => {
  const { activityStore } = useStore();
  const { setIsView, setIsEdit, setSelectedActivity, deleteActivity } = activityStore;
  const cm = useRef<any>(null);
  const [currentContextMenu, setCurrentContextMenu] = useState<JSX.Element>();

  const items: MenuItem[] = [
    {
      label: "View",
      icon: "pi pi-fw pi-search",
      command: () => {
        setIsView(true);
      },
    },
    {
      label: "Edit",
      icon: "pi pi-fw pi-file-edit",
      command: () => {
        setIsEdit(true);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-fw pi-trash",
      command: () => {
        confirmDialog({
          message: "Are you sure you want to delete this activity?",
          header: "Confirm",
          icon: "pi pi-exclamation-triangle",
          acceptClassName: "p-button-danger",
          accept: () => {
            deleteActivity(undefined);
          },
          reject: () => {
            setSelectedActivity(undefined);
          },
        });
      },
    },
  ];

  const titleNode = (
    <>
      <div className="flex justify-content-between mb-3">
        <div>
          <NavLink to={`/activity/${activity.id}`} className="block">
            {activity.title}
          </NavLink>
        </div>
        <div
          className="flex align-items-center justify-content-center bg-blue-100 border-round"
          style={{ width: "2.5rem", height: "2.5rem" }}
          onClick={() => deleteActivity(activity.id)}
        >
          <FontAwesomeIcon icon={faEraser} size="2xs" style={{ color: "var(--red-400)" }} />
        </div>
      </div>
    </>
  );

  return (
    <>
      <ContextMenu
        model={items}
        ref={cm}
        breakpoint="767px"
        onShow={() => {
          setCurrentContextMenu(cm.current.getElement());
          console.log(currentContextMenu);
        }}
      />
      <Card
        title={titleNode}
        className="m-3 custom-card surface-0 shadow-2 p-3 border-1 border-50 border-round"
        onContextMenu={(e) => {
          e.preventDefault();
          setSelectedActivity(activity.id);
          cm.current.show(e);
        }}
      >
        <p className="m-0 font-light font-italic text-lg">{activity.description}</p>
        <p className="m-0">{activity.category}</p>
        <p className="m-0">{activity.city}</p>
        <p className="m-0">{activity.venue}</p>
      </Card>

      {/* <div className="col-12">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">{activity.title}</span>
              <div className="text-900 font-medium text-xl">152</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
            </div>
          </div>
          <span className="text-green-500 font-medium">24 new </span>
          <span className="text-500">since last visit</span>
        </div>
      </div> */}
    </>
  );
};

export default observer(ActitvityItem);
