import { useField } from "formik"
import { Password } from "primereact/password"

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  feedback?: boolean;
}

const PasswordInput = (props: Props) => {
  const [field, meta] = useField(props.name)
  return (
    <>
      <label>{props.label}</label>
      <Password
        {...field}
        {...props}
        placeholder={props.placeholder ?? "Password"}
        inputClassName={props.inputClassName ?? "p-inputtext p-component p-password-input w-full p-3 md:w-30rem"}
        feedback={props.feedback ?? true}
        toggleMask
      />
      {meta.touched && meta.error ? <div className="text-red-500 m-2 mt-0">{meta.error}</div> : null}
    </>
  )
}

export default PasswordInput
