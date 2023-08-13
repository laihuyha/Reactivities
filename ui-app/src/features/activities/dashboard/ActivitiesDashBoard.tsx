import ActivitiesList from "./ActivitiesList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import { Sidebar, SidebarProps } from "primereact/sidebar";
import { Dialog, DialogProps } from "primereact/dialog";
import { useStore } from "../../../app/stores/store";
import { useLayoutEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";

const ActivitiesDashBoard = () => {
  const { activityStore } = useStore();
  const { selectedActivity, isEdit, isView, isCreate } = activityStore;
  const { setIsView, setIsEdit, setIsCreate, setSelectedActivity, loadActivitiesData } = activityStore;

  useLayoutEffect(() => {
    loadActivitiesData();
  }, [activityStore, loadActivitiesData]);

  //#region Props
  const sidebarProps: SidebarProps = {
    visible: isView,
    onHide: () => {
      setIsView(false);
      setSelectedActivity(undefined);
    },
    position: "right",
    style: {
      width: "40vw",
    },
    children: [<ActivityDetails key={"activityDetails"} activity={selectedActivity} />],
  };

  const dialogProps: DialogProps = {
    header: "Edit Activity",
    footer: [
      <div className="card flex justify-content-center" key={"footer"}>
        <Button
          key={"saveBtn"}
          label="Save"
          icon="pi pi-check"
          className="p-button bg-primary"
          onClick={() => {
            console.log(selectedActivity);
          }}
        />
      </div>,
    ],
    draggable: false,
    position: "center",
    visible: isEdit || isCreate,
    children: [<ActivityForm key={"activityForm"} activity={selectedActivity} />],
    onHide: () => {
      setIsEdit(false);
      setIsCreate(false);
      setSelectedActivity(undefined);
    },
  };
  //#endregion

  return (
    <>
      <ActivitiesList />
      <Sidebar {...sidebarProps} />
      <Dialog {...dialogProps} />
    </>
  );
};

export default observer(ActivitiesDashBoard);
