import { useField } from "formik"
import { HTMLInputTypeAttribute } from "react"

interface Props {
  placeholder: string;
  name: string;
  className?: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
}

const TextInput = (props: Props) => {
  const [field, meta] = useField(props.name)
  return (
    <>
      <label>{props.label}</label>
      <input {...field} {...props} className={props.className ?? "p-inputtext"} />
      {meta.touched && meta.error ? <div className="text-red-500 m-2 mt-0">{meta.error}</div> : null}
    </>
  )
}
export default TextInput
