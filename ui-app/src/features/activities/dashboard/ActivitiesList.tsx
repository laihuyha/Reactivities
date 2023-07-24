import Activity from "../../../app/models/activity";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

interface Props {
  activities: Activity[];
  onClick: () => void;
}

const template = (activity: Activity, onClick: () => void) => {
  return (
    <div className="col-12">
      <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
        <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
          <div className="flex flex-column align-items-center sm:align-items-start gap-3">
            <div className="text-2xl font-bold text-900">{activity.title}</div>
            <div className="font-semibold text-600">{activity.date}</div>
            <div className="flex align-items-center gap-3">
              <span className="flex align-items-center gap-2">
                <i className="pi pi-tag"></i>
                <span className="font-semibold">{activity.category}</span>
              </span>
              <Tag value={activity.city} severity="info"></Tag>
            </div>
          </div>
          <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
            <span className="text-2xl font-semibold">
              {activity.description}
            </span>
            <Button
              icon="pi pi-map"
              className="p-button-rounded"
              onClick={onClick}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivitiesList = ({ activities, onClick }: Props) => {
  return (
    <DataView
      style={{
        width: "95%",
      }}
      paginator={true}
      rows={4}
      value={activities}
      itemTemplate={(activity) => template(activity, onClick)}
    />
  );
};

export default ActivitiesList;
