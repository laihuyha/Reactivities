import { Card } from "primereact/card";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { InputText } from "primereact/inputtext";

const ActivityForm = () => {
  const header = (
    <img
      alt="Card"
      src="https://primefaces.org/cdn/primereact/images/usercard.png"
    />
  );
  return (
    <>
      <Card header={header}>
        <div className="flex justify-content-center">
          <InputText className="col-12" placeholder="Title" />
        </div>
        <Calendar
          className="col-12 p-0 mt-2"
          value={null}
          onChange={(e: CalendarChangeEvent) => {
            console.log(e);
          }}
          inputClassName="col-12"
          placeholder="Select a date"
        />
      </Card>
    </>
  );
};
export default ActivityForm;
