import ActivitiesList from "./ActivitiesList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Sidebar, SidebarProps } from "primereact/sidebar";
import { Dialog, DialogProps } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import "./styles/styles.scss";

const ActivitiesDashBoard = () => {
  const { activityStore } = useStore();
  const { selectedActivity, isEdit, isView, isCreate, isLoading, initLoading } = activityStore;
  const { setIsView, setIsEdit, setIsCreate, setSelectedActivity, loadActivitiesData, submitForm } = activityStore;

  useEffect(() => {
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
          loading={isLoading}
          onClick={() => {
            selectedActivity && submitForm(selectedActivity);
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
  if (initLoading) return <LoadingComponent />;

  return (
    <>
      <div className="grid">
        <div className="col-12">
          <ActivitiesList />
        </div>
      </div>
      <Sidebar {...sidebarProps} />
      <Dialog {...dialogProps} />
      <ConfirmDialog />
    </>
  );
};

export default observer(ActivitiesDashBoard);
