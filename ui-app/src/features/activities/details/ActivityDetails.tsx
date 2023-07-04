import { Button } from "primereact/button";
import { Card } from "primereact/card";
import Activity from "../../../app/models/activity";
interface Props {
  activity: Activity;
}
const ActivityDetails = ({ activity }: Props) => {
  const header = (
    <img
      alt="Card"
      src="https://primefaces.org/cdn/primereact/images/usercard.png"
    />
  );
  const footer = (
    <div className="flex flex-wrap justify-content-between gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-outlined p-button-secondary"
      />
      <Button label="Save" icon="pi pi-check" />
    </div>
  );
  return (
    activity && (
      <div className="card" style={{ maxWidth: "95%" }}>
        <Card title={`${activity.title}`} header={header} footer={footer}>
          <p className="m-2">{activity.date}</p>
          <p className="m-2">{activity.description}</p>
          <p className="m-2">{activity.category}</p>
          <p className="m-2">{activity.city}</p>
          <p className="m-2">{activity.venue}</p>
        </Card>
      </div>
    )
  );
};

export default ActivityDetails;
