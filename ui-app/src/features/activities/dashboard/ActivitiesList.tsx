import { Fragment } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { dateTimeHelper } from "../../../utils/helper";
import { Fieldset } from "primereact/fieldset";
import ActivityItem from "./ActivityItem";
import "./styles/styles.scss";

const ActivitiesList = () => {
  const { activityStore } = useStore();
  const { groupedActivities } = activityStore;
  const { toDisplayDateTime } = dateTimeHelper;

  return (
    <>
      {groupedActivities.map(([groupKey, actitvities]) => (
        <Fragment key={groupKey}>
          <Fieldset className="mb-3" legend={toDisplayDateTime(groupKey)} toggleable>
            {actitvities.map((e) => (
              <ActivityItem key={e.id} activity={e} />
            ))}
          </Fieldset>
        </Fragment>
      ))}
    </>
  );
};

export default observer(ActivitiesList);
