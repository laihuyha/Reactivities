import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";
import Activity from "../models/activity";
import ActivityServices from "../api/services/activities";
import AppStore from "./appStore";
import { dateTimeHelper } from "../../utils/helper";

export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity?: Activity;
  filterDateRange?: Date[] = [];
  selectedCategories: string[] = [];
  isCreate: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  isLoading: boolean = false;
  initLoading: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  get sortedActivities() {
    const mappedActivities = new Map(
      this.activities.map(({ title, ...rest }) => [Number(title.slice(14)), { title, ...rest }])
    );

    // key-value pair => [key, value] = a return a[1] mean return value
    return [...mappedActivities].sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  }

  get groupedActivities() {
    let x = Object.entries(
      this.activities.reduce((acc, curr) => {
        const date = curr.date;
        acc[date] = acc[date] ? [...acc[date], curr] : [curr];
        return acc;
      }, {} as { [key: string]: Activity[] })
    ).sort((a, b) => a[0].localeCompare(b[0]));

    x.forEach((activities) => {
      activities[1].sort((a, b) => a.title.localeCompare(b.title));
      if (this.selectedCategories.length > 0) {
        activities[1] = activities[1].filter((a) => this.selectedCategories.includes(a.category));
      }
    });

    x = x.filter((a) => a[1].length > 0);

    if (this.filterDateRange && this.filterDateRange.length > 0) {
      x = x.filter((a) => {
        let date = dateTimeHelper.convertTimeString(a[0]);
        return this.filterDateRange![0] <= date && date <= this.filterDateRange![1];
      });
    }

    return x;
  }

  loadActivitiesData = async () => {
    this.initLoading = true;
    try {
      const activities = await ActivityServices.list();
      runInAction(() => {
        this.activities = activities;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.initLoading = false;
      });
    }
  };

  initFormData = () => {
    this.selectedActivity = {
      id: uuid(),
      category: "",
      city: "",
      date: "",
      description: "",
      title: "",
      venue: "",
    };
  };

  submitForm = async (activity: Activity) => {
    this.setIsLoading(true);
    try {
      if (this.isCreate && !this.isEdit) {
        await ActivityServices.create(activity);
        runInAction(() => {
          this.activities = [...this.activities, activity];
        });
        AppStore.notify?.success("Activity Created Successfully!");
      }
      if (this.isEdit && !this.isCreate) {
        await ActivityServices.update(activity);
        let exist = this.activities.findIndex((e) => e.id === activity.id);
        runInAction(() => {
          this.activities[exist] = { ...this.activities[exist], ...activity };
        });
        AppStore.notify?.success("Activity Updated Successfully!");
      }
    } catch (error) {
      AppStore.notify?.error(`Something went wrong! Details: \n${error}`);
    } finally {
      this.setIsLoading(false);
      this.setIsCreate(false);
      this.setIsEdit(false);
    }
  };

  deleteActivity = async () => {
    if (!this.selectedActivity) return;
    this.isLoading = true;
    try {
      await ActivityServices.delete(this.selectedActivity?.id);
      AppStore.notify?.success("Activity Deleted Successfully!");
    } catch (error) {
      console.log(error);
      AppStore.notify?.error(`Something went wrong! Details: ${error}`);
    } finally {
      runInAction(() => {
        this.activities = this.activities.filter((e) => e.id !== this.selectedActivity?.id);
        this.setSelectedActivity(undefined);
        this.isLoading = false;
      });
    }
  };

  setSelectedActivity = (activityId?: string) => {
    if (!activityId) return;
    let activity = this.activities.find((e) => e.id === activityId);

    if (activity) {
      this.selectedActivity = { ...activity };
    } else {
      this.selectedActivity = undefined;
    }
  };

  setFilterDateRange = (dateRange: any) => {
    this.filterDateRange = dateRange;
  };

  setSelectedCategories = (category: string) => {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter((e) => e !== category);
    } else {
      this.selectedCategories = [...this.selectedCategories, category];
    }
  };

  toggleIsEdit = () => {
    this.isEdit = !this.isEdit;
  };

  toggleIsView = () => {
    this.isView = !this.isView;
  };

  setIsCreate = (isCreate: boolean) => {
    this.isCreate = isCreate;
  };

  setIsEdit = (isEdit: boolean) => {
    this.isEdit = isEdit;
  };

  setIsView = (isView: boolean) => {
    this.isView = isView;
  };

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };
}
