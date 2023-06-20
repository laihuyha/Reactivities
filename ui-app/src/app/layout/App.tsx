import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import ModelToColumns from "../../utils/helper";
import Activity from "../models/activity";

const App = () => {
  const [activities, setListActivities] = useState<Activity[]>();
  const [columns, setColumns] = useState<any[]>();
  useEffect(() => {
    axios.get("https://localhost:5001/api/Activities").then((res) => {
      setListActivities(res.data);
      setColumns(ModelToColumns(res.data[0]));
    });
  }, []);

  console.log(columns);

  return (
    <div className="App">
      <DataTable value={activities} tableStyle={{ minWidth: "50rem" }}>
        <Column field="title" header="Title"></Column>
        <Column field="date" header="Date"></Column>
        <Column field="description" header="Description"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="city" header="City"></Column>
      </DataTable>
    </div>
  );
};

export default App;
