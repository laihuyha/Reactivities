import Activity from "../../../app/models/activity";
import ActivitiesList from "./ActivitiesList";
import { Sidebar, SidebarProps } from "primereact/sidebar";
import { useState } from "react";
import ActivityDetails from "../details/ActivityDetails";

interface Props {
  activities: Activity[];
}

const ActivitiesDashBoard = ({ activities }: Props) => {
  const [visible, setVisible] = useState<boolean>(false);

  const mappedActivities = new Map<number, Activity>();

  if (activities.length > 0) {
    activities.map((x) =>
      mappedActivities.set(Number(x.title.substring(14)), x)
    );
  }

  const sortedArr = [...mappedActivities].sort((a, b) => a[0] - b[0]);
  const sortedActivities = sortedArr.map((x) => x[1]);

  const onClick = () => {
    setVisible(true);
  };

  const SidebarProps: SidebarProps = {
    visible: visible,
    onHide: () => setVisible(false),
    position: "right",
    style: {
      width : "40vw"
    },
  };

  return (
    <>
      <ActivitiesList activities={sortedActivities} onClick={onClick} />
      <Sidebar {...SidebarProps}>
        <ActivityDetails activity={sortedActivities[0]} />
      </Sidebar>
    </>
  );
};

export default ActivitiesDashBoard;
