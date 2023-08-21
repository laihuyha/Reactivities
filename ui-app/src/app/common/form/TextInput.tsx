import { useField } from "formik";

interface Props {
  placeholder: string;
  name: string;
  className?: string;
  label?: string;
}

const TextInput = (props: Props) => {
  const [field, meta] = useField(props.name);
  return (
    <>
      <label>{props.label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? <div className="text-red-500 m-2">{meta.error}</div> : null}
    </>
  );
};
export default TextInput;
