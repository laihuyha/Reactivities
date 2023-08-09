import Activity from "../../../app/models/activity";
import ActivitiesList from "./ActivitiesList";
import ActivityDetails from "../details/ActivityDetails";
import { Sidebar, SidebarProps } from "primereact/sidebar";
import { useState } from "react";
import { Dialog, DialogProps } from "primereact/dialog";
import ActivityForm from "../form/ActivityForm";

interface Props {
  activities: Activity[];
}

const ActivitiesDashBoard = ({ activities }: Props) => {
  //#region Modal and Sidebar state
  const [visible, setVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  //#endregion

  // useEffect(() => {
  //   if (selectedActivity) console.log(selectedActivity); // Move the console.log here
  // }, [selectedActivity]);

  const mappedActivities = new Map<number, Activity>();
  if (activities.length > 0) {
    activities.map((x) =>
      mappedActivities.set(Number(x.title.substring(14)), x)
    );
  }
  const sortedArr = [...mappedActivities].sort((a, b) => a[0] - b[0]);
  const sortedActivities = sortedArr.map((x) => x[1]);

  const getReturnData = (activity: Activity) => {
    if (activity) setSelectedActivity(activity);
  };

  const onEdit = () => {
    setModalVisible(true);
  };
  const onClick = () => {
    setVisible(true);
  };

  //#region Props
  const sidebarProps: SidebarProps = {
    visible: visible,
    onHide: () => setVisible(false),
    position: "right",
    style: {
      width: "40vw",
    },
  };

  const dialogProps: DialogProps = {
    header: "Edit Activity",
    draggable: false,
    // maximizable: true,
    position: "center",
    visible: modalVisible,
    children: [<ActivityForm key={"activeForm"} activity={selectedActivity} />],
    onHide: () => setModalVisible(false),
  };
  //#endregion

  return (
    <>
      <ActivitiesList
        activities={sortedActivities}
        onClick={onClick}
        onEdit={onEdit}
        getReturnData={getReturnData}
      />
      <Sidebar {...sidebarProps}>
        <ActivityDetails activity={selectedActivity} />
      </Sidebar>
      <Dialog {...dialogProps} />
    </>
  );
};

export default ActivitiesDashBoard;
