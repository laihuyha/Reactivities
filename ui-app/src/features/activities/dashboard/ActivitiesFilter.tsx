import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { useRef } from "react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useStore } from "../../../app/stores/store";
import { Checkbox } from "primereact/checkbox";
import Activity from "../../../app/models/activity";

const ActivitiesFilter = () => {
  const { activityStore, appStore } = useStore();
  const { setSideBarShowState } = appStore;
  const { activities, filterDateRange, selectedCategories } = activityStore;
  const { setFilterDateRange, setSelectedCategories } = activityStore;
  const menuRight = useRef<Menu>(null);

  const itemTemplate = (activity: Activity) => {
    return (
      <>
        <div key={activity.category} className="flex align-items-center m-3">
          <Checkbox
            inputId={activity.id}
            name="category"
            value={activity.category}
            onChange={(e) => {
              setSelectedCategories(e.value);
            }}
            checked={selectedCategories.some((item) => item === activity.category)}
          />
          <label htmlFor={activity.id} className="ml-2">
            {activity.category}
          </label>
        </div>
      </>
    );
  };

  const items: MenuItem[] = [];

  activities.forEach((a) => {
    if (items.some((e) => e.label === a.category)) return;
    items.push({ label: a.category, template: itemTemplate(a) });
  });

  return (
    <>
      <div className="flex flex-row align-items-center justify-content-between">
        <div>
          <span className="ml-3">Date Range :</span>
          <Calendar
            className="ml-3 w-auto"
            value={filterDateRange}
            onChange={(e) => {
              setFilterDateRange(e.value);
            }}
            selectionMode="range"
            dateFormat="dd/mm/yy"
            readOnlyInput
            showButtonBar
            showIcon
          />
        </div>
        <div
          onClick={() => {
            setSideBarShowState(true);
          }}
        >
          show sidebar
        </div>
        <div>
          <Button
            icon="pi pi-filter"
            className="mr-3"
            onClick={(event) => menuRight?.current?.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
          />
          <Menu
            model={items}
            popup
            ref={menuRight}
            id="popup_menu_right"
            popupAlignment="right"
            className="max-h-20rem overflow-auto"
          />
        </div>
      </div>
    </>
  );
};

export default observer(ActivitiesFilter);
