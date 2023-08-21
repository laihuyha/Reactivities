import Activity from "../../../app/models/activity";
import { Form, Formik } from "formik";
import { Button } from "primereact/button";
import { useStore } from "../../../app/stores/store";
import * as yup from "yup";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import DateInput from "../../../app/common/form/DateInput";

interface Props {
  activity?: Activity;
}

const ActivityForm = ({ activity }: Props) => {
  const { activityStore } = useStore();
  const { isLoading } = activityStore;
  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    date: yup.date().required("Date is required"),
    category: yup.string().required("Category is required"),
    city: yup.string().required("City is required"),
    description: yup.string(),
    venue: yup.string(),
  });
  return (
    <>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity as Activity}
        onSubmit={(e) => {
          console.log(e);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
              <div className="flex flex-column justify-content-center mb-3">
                <TextInput name="title" placeholder="Title" className="col-12 p-inputtext" />
              </div>
              <div className="flex flex-column justify-content-center mb-3">
                <TextInput name="category" placeholder="Category" className="col-12 p-inputtext" />
              </div>
              <DateInput name="date" placeholder="Date" className="col-12 p-0" />
              <div className="flex flex-column justify-content-center mb-3">
                <TextInput name="city" placeholder="City" className="col-12 p-inputtext" />
              </div>
              <div className="flex flex-column justify-content-center mb-3">
                <TextInput name="venue" placeholder="Venue" className="col-12 p-inputtext" />
              </div>
              <div className="flex justify-content-center">
                <TextAreaInput name="description" placeholder="Description" className="p-inputtextarea col-12 mb-2" />
              </div>
              <div className="card flex justify-content-center mt-2 mb-0">
                <Button
                  label="Save"
                  icon="pi pi-check"
                  type="submit"
                  className="p-button bg-primary"
                  loading={isLoading}
                />
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default ActivityForm;
