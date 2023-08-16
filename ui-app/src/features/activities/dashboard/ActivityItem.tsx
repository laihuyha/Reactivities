import { observer } from "mobx-react-lite";
import { Card } from "primereact/card";
import { NavLink } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { MutableRefObject } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { dateTimeHelper } from "../../../utils/helper";
import Activity from "../../../app/models/activity";

interface Props {
  activity: Activity;
  cmRef: MutableRefObject<any>;
}

const ActitvityItem = ({ activity, cmRef }: Props) => {
  const { activityStore } = useStore();
  const { setSelectedActivity, deleteActivity } = activityStore;
  const { toDisplayDateTime } = dateTimeHelper;

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
          onClick={async () => {
            confirmDialog({
              message: "Are you sure you want to delete this activity?",
              header: "Confirm",
              icon: "pi pi-exclamation-triangle",
              draggable: false,
              acceptClassName: "p-button-danger",
              accept: async () => {
                setSelectedActivity(activity.id);
                await deleteActivity();
              },
              reject: () => {
                setSelectedActivity(undefined);
              },
            });
          }}
        >
          <FontAwesomeIcon icon={faEraser} size="2xs" style={{ color: "var(--red-400)" }} />
        </div>
      </div>
    </>
  );

  const footer = (
    <div className="flex align-items-center justify-content-between">
      <p className="m-0">{activity.description}</p>
    </div>
  );

  return (
    <>
      <Card
        title={titleNode}
        className="m-3 custom-card surface-0 shadow-2 hover:shadow-8 p-3 border-2 border-50 border-round-2xl"
        onContextMenu={(e) => {
          e.preventDefault();
          setSelectedActivity(activity.id);
          cmRef.current.show(e);
        }}
        footer={footer}
      >
        <div className="flex align-items-center mt-2">
          <i className="pi pi-clock mr-2" style={{ color: "var(--bluegray-500)" }}></i>
          <p className="m-0">{toDisplayDateTime(activity.date)}</p>
        </div>
        <div className="flex align-items-center mt-2">
          <i className="pi pi-hashtag mr-2" style={{ color: "var(--pink-500)" }}></i>
          <Tag severity="info" value={activity.category} style={{ blockSize: "1rem", fontSize: "1rem" }}></Tag>
        </div>
        <div className="flex align-item-center justify-content-between mt-2">
          <div className="flex align-items-center">
            <i className="pi pi-map-marker mr-2" style={{ color: "var(--teal-500)" }}></i>
            <p className="m-0">{activity.city}</p>
          </div>
          <div className="flex align-items-center">
            <i className="pi pi-bookmark-fill mr-2" style={{ color: "var(--teal-500)" }}></i>
            <p className="m-0">{activity.venue}</p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default observer(ActitvityItem);
