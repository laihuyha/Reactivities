import ActivitiesList from "./ActivitiesList"
import ActivityDetails from "../details/ActivityDetails"
import ActivityForm from "../form/ActivityForm"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import { Sidebar, SidebarProps } from "primereact/sidebar"
import { Dialog, DialogProps } from "primereact/dialog"
import { ConfirmDialog } from "primereact/confirmdialog"
import { useStore } from "../../../app/stores/store"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import "./styles/styles.scss"

const ActivitiesDashBoard = () => {
  const { activityStore } = useStore()
  const { selectedActivity, isEdit, isView, isCreate, initLoading } = activityStore
  const { setIsView, setIsEdit, setIsCreate, setSelectedActivity, loadActivitiesData } = activityStore

  useEffect(() => {
    loadActivitiesData()
  }, [activityStore, loadActivitiesData])

  //#region Props
  const sidebarProps: SidebarProps = {
    visible: isView,
    onHide: () => {
      setIsView(false)
      setSelectedActivity(undefined)
    },
    position: "right",
    style: {
      width: "40vw",
    },
    children: [<ActivityDetails key={"activityDetails"} activity={selectedActivity} />],
  }

  const dialogProps: DialogProps = {
    header: isEdit ? "Edit Activity" : "Create Activity",
    draggable: false,
    position: "center",
    visible: isEdit || isCreate,
    children: [<ActivityForm key={"activityForm"} activity={selectedActivity} />],
    onHide: () => {
      setIsEdit(false)
      setIsCreate(false)
      setSelectedActivity(undefined)
    },
  }
  //#endregion
  if (initLoading) return <LoadingComponent />

  return (
    <>
      <ActivitiesList />
      <Sidebar {...sidebarProps} />
      <Dialog {...dialogProps} />
      <ConfirmDialog />
    </>
  )
}

export default observer(ActivitiesDashBoard)
