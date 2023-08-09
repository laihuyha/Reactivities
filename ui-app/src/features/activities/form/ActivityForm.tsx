import { Card } from "primereact/card";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import Activity from "../../../app/models/activity";

interface Props {
  activity?: Activity;
}

const ActivityForm = ({ activity }: Props) => {
  const header = (
    <img
      alt="Card"
      src="https://primefaces.org/cdn/primereact/images/usercard.png"
    />
  );
  return activity ? (
    <>
      <Card header={header}>
        <div className="flex justify-content-center">
          <InputText
            className="col-12"
            placeholder="Title"
            value={activity.title}
          />
        </div>
        <Calendar
          className="col-12 p-0 mt-2 mb-2"
          value={new Date(activity.date)}
          dateFormat="dd/mm/yy"
          onChange={(e: CalendarChangeEvent) => {
            console.log(e);
          }}
          inputClassName="col-12"
          placeholder="Select a date"
        />
        <div className="flex justify-content-center mb-2">
          <InputText
            className="col-12"
            placeholder="Category"
            value={activity.category}
          />
        </div>
        <div className="flex justify-content-center mb-2">
          <InputText
            className="col-12"
            placeholder="City"
            value={activity.city}
          />
        </div>
        <div className="flex justify-content-center">
          <InputTextarea
            className="col-12"
            placeholder="Descriptions"
            value={activity.description}
          />
        </div>
      </Card>
    </>
  ) : (
    <></>
  );
};
export default ActivityForm;
