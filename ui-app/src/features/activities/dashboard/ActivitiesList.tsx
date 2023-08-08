import Activity from "../../../app/models/activity";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { useRef } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";

interface Props {
  activities: Activity[];
  onClick: () => void;
  onEdit: () => void;
}

const ActivitiesList = ({ activities, onClick, onEdit }: Props) => {
  const cm = useRef<any>(null);

  const items: MenuItem[] = [
    {
      label: "View",
      icon: "pi pi-fw pi-search",
      command: () => {
        onClick();
      },
    },
    {
      label: "Edit",
      icon: "pi pi-fw pi-file-edit",
      command: () => {
        onEdit();
      },
    },
    { label: "Delete", icon: "pi pi-fw pi-trash" },
  ];

  const template = (activity: Activity) => {
    return (
      <div
        className="col-12"
        onContextMenu={(e) => {
          e.preventDefault();
          cm.current.show(e);
        }}
      >
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">
                {activity.title}
              </div>
              <div className="font-semibold font-italic text-700">
                {activity.date}
              </div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold font-italic">
                    {activity.category}
                  </span>
                </span>
                <Tag
                  className="font-italic"
                  value={activity.city}
                  severity="info"
                ></Tag>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-bold">{activity.description}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ContextMenu model={items} ref={cm} breakpoint="767px" />
      <DataView
        style={{
          width: "95%",
        }}
        paginator={true}
        rows={5}
        value={activities}
        itemTemplate={(activity) => template(activity)}
      />
    </>
  );
};

export default ActivitiesList;
