import { useField } from "formik";
import { InputTextarea } from "primereact/inputtextarea";

interface Props {
  placeholder: string;
  name: string;
  className?: string;
  label?: string;
}

const TextAreaInput = (props: Props) => {
  const [field, meta] = useField(props.name);

  return (
    <>
      <label>{props.label}</label>
      <InputTextarea {...field} {...props} autoResize />
      {meta.touched && meta.error ? <div className="text-red-500 m-2">{meta.error}</div> : null}
    </>
  );
};

export default TextAreaInput;
