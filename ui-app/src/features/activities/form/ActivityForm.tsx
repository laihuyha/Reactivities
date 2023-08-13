import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import Activity from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { dateTimeHelper } from "../../../utils/helper";

interface Props {
  activity?: Activity;
}

const ActivityForm = ({ activity }: Props) => {
  const { activityStore } = useStore();
  const { handleChangeFormData } = activityStore;
  const { convertTimeString } = dateTimeHelper;
  return (
    <>
      <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
      <div className="flex justify-content-center">
        <InputText
          className="col-12"
          placeholder="Title"
          defaultValue={activity?.title}
          onChange={(e) => {
            handleChangeFormData("title", e.target.value);
          }}
        />
      </div>
      <Calendar
        className="col-12 p-0 mt-2 mb-2"
        value={convertTimeString(activity?.date)}
        dateFormat="dd/mm/yy"
        onChange={(e: CalendarChangeEvent) => {
          const value = e.target.value?.toLocaleString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          });
          handleChangeFormData("date", value?.replaceAll("/", ""));
        }}
        inputClassName="col-12"
        placeholder="Select a date"
      />
      <div className="flex justify-content-center mb-2">
        <InputText
          className="col-12"
          placeholder="Category"
          defaultValue={activity?.category}
          onChange={(e) => {
            handleChangeFormData("category", e.target.value);
          }}
        />
      </div>
      <div className="flex justify-content-center mb-2">
        <InputText
          className="col-12"
          placeholder="Venue"
          defaultValue={activity?.venue}
          onChange={(e) => {
            handleChangeFormData("venue", e.target.value);
          }}
        />
      </div>
      <div className="flex justify-content-center mb-2">
        <InputText
          className="col-12"
          placeholder="City"
          defaultValue={activity?.city}
          onChange={(e) => {
            handleChangeFormData("city", e.target.value);
          }}
        />
      </div>
      <div className="flex justify-content-center">
        <InputTextarea
          className="col-12"
          placeholder="Descriptions"
          defaultValue={activity?.description}
          onChange={(e) => {
            handleChangeFormData("description", e.target.value);
          }}
        />
      </div>
    </>
  );
};
export default ActivityForm;
