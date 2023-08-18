import { Fragment, useRef } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { dateTimeHelper } from "../../../utils/helper";
import { Fieldset } from "primereact/fieldset";
import ActivityItem from "./ActivityItem";
import { confirmDialog } from "primereact/confirmdialog";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import "./styles/styles.scss";
import ActivitiesFilter from "./ActivitiesFilter";

const ActivitiesList = () => {
  const { activityStore } = useStore();
  const { groupedActivities } = activityStore;
  const { setIsView, setIsEdit, setSelectedActivity, deleteActivity } = activityStore;
  const { toDisplayDateTime } = dateTimeHelper;

  const cm = useRef<any>(null);

  const items: MenuItem[] = [
    {
      label: "View",
      icon: "pi pi-fw pi-search",
      command: () => {
        setIsView(true);
      },
    },
    {
      label: "Edit",
      icon: "pi pi-fw pi-file-edit",
      command: () => {
        setIsEdit(true);
      },
    },
    {
      label: "Delete",
      icon: "pi pi-fw pi-trash",
      command: () => {
        confirmDialog({
          message: "Are you sure you want to delete this activity?",
          header: "Confirm",
          draggable: false,
          icon: "pi pi-exclamation-triangle",
          acceptClassName: "p-button-danger",
          accept: deleteActivity,
          reject: () => {
            setSelectedActivity(undefined);
          },
        });
      },
    },
  ];

  return (
    <>
      <ContextMenu model={items} ref={cm} breakpoint="767px" />
      <span className="activities-list border-round">
        <ActivitiesFilter />
        {groupedActivities.map(([groupKey, actitvities]) => (
          <Fragment key={groupKey}>
            <Fieldset className="m-3" legend={toDisplayDateTime(groupKey)} toggleable>
              {actitvities.map((e) => (
                <ActivityItem key={e.id} activity={e} cmRef={cm} />
              ))}
            </Fieldset>
          </Fragment>
        ))}
      </span>
    </>
  );
};

export default observer(ActivitiesList);
