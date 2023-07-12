import Activity from "../../../app/models/activity";
import { Splitter, SplitterPanel } from "primereact/splitter";
import ActivitiesList from "./ActivitiesList";
import ActivityDetails from "../details/ActivityDetails";

interface Props {
  activities: Activity[];
}

const ActivitiesDashBoard = ({ activities }: Props) => {
  const mappedActivities = new Map<number, Activity>();
  if (activities.length > 0) {
    activities.map((x) =>
      mappedActivities.set(Number(x.title.substring(14)), x)
    );
  }

  const sortedArr = [...mappedActivities].sort((a, b) => a[0] - b[0]);
  const sortedActivities = sortedArr.map((x) => x[1]);
  return (
    <>
      <Splitter style={{ height: "90vh" }}>
        <SplitterPanel
          size={65}
          className="flex align-items-center justify-content-center"
        >
          <ActivitiesList activities={sortedActivities} />
        </SplitterPanel>
        <SplitterPanel
          size={35}
          className="flex align-items-center justify-content-center"
        >
          <ActivityDetails activity={sortedActivities[0]} />
        </SplitterPanel>
      </Splitter>
    </>
  );
};

export default ActivitiesDashBoard;
