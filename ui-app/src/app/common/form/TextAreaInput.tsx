import { useField } from "formik"
import { InputTextarea } from "primereact/inputtextarea"

interface Props {
  placeholder: string;
  name: string;
  className?: string;
  label?: string;
}

const TextAreaInput = (props: Props) => {
  const [field, meta] = useField(props.name)

  return (
    <>
      <label>{props.label}</label>
      <InputTextarea {...field} {...props} className={props.className ?? "p-inputtextarea"} autoResize />
      {meta.touched && meta.error ? <div className="text-red-500 m-2 mt-0">{meta.error}</div> : null}
    </>
  )
}

export default TextAreaInput
