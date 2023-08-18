import { observer } from "mobx-react-lite";
import { Calendar } from "primereact/calendar";
import { useState } from "react";

const ActivitiesFilter = () => {
  const [dates, setDates] = useState<any>(null);
  return (
    <>
      <Calendar
        className="ml-3 w-auto"
        value={dates}
        onChange={(e) => {
          setDates(e.value);
        }}
        selectionMode="range"
        readOnlyInput
      />
    </>
  );
};

export default observer(ActivitiesFilter);
