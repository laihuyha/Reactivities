import { Card } from "primereact/card"
import { dateTimeHelper } from "../../../utils/helper"
import Activity from "../../../app/models/activity"
import { Tag } from "primereact/tag"
import { useLoaderData } from "react-router-dom"
import { useStore } from "../../../app/stores/store"
interface Props {
  activity?: Activity;
}
const ActivityDetails = ({ activity }: Props) => {
  const { activityStore } = useStore()
  const { activities } = activityStore
  const activityId = useLoaderData()
  const act = activities.find((a) => a.id === activityId)
  const actitityData = activity ?? act
  const header = (
    <img style={{ maxHeight: "33rem" }} alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
  )

  const footer = (
    <div className="flex align-items-center justify-content-between">
      <p className="m-0">{actitityData?.description}</p>
    </div>
  )

  const { toDisplayDateTime } = dateTimeHelper

  return actitityData ? (
    <div className="card" style={{ width: "100%", height: "100%" }}>
      <Card style={{ height: "100%" }} title={`${actitityData.title}`} header={header} footer={footer}>
        <div className="flex align-items-center mt-2 p-2">
          <i className="pi pi-clock mr-2" style={{ color: "var(--bluegray-500)" }}></i>
          <p className="m-0">{toDisplayDateTime(actitityData.date)}</p>
        </div>
        <div className="flex align-items-center mt-2 p-2">
          <i className="pi pi-hashtag mr-2" style={{ color: "var(--pink-500)" }}></i>
          <Tag severity="info" value={actitityData.category} style={{ blockSize: "1rem", fontSize: "1rem" }}></Tag>
        </div>
        <div className="flex align-item-center justify-content-between mt-2 p-2">
          <div className="flex align-items-center">
            <i className="pi pi-map-marker mr-2" style={{ color: "var(--teal-500)" }}></i>
            <p className="m-0">{actitityData.city}</p>
          </div>
          <div className="flex align-items-center">
            <i className="pi pi-bookmark-fill mr-2" style={{ color: "var(--teal-500)" }}></i>
            <p className="m-0">{actitityData.venue}</p>
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <></>
  )
}

export default ActivityDetails
