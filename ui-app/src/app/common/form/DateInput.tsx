import { useField } from "formik"
import { Calendar } from "primereact/calendar"
import { dateTimeHelper } from "../../../utils/helper"

interface Props {
  placeholder: string;
  name: string;
  className?: string;
  label?: string;
}

const DateInput = (props: Props) => {
  const { convertTimeString } = dateTimeHelper
  const [field, meta, helper] = useField(props.name)
  return (
    <div className="mb-3">
      <Calendar
        {...field}
        {...props}
        value={meta.touched && meta.value ? field.value : field.value ? convertTimeString(field.value) : undefined}
        inputClassName="col-12"
        dateFormat="dd/mm/yy"
        onChange={(e) => helper.setValue(e.target.value)}
      />
      {meta.touched && meta.error ? <div className="text-red-500 m-2">{meta.error}</div> : null}
    </div>
  )
}
export default DateInput
