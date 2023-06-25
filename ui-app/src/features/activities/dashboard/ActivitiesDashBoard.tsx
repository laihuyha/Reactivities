import { Column, ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import Activity from "../../../app/models/activity";
import ModelToColumns from "../../../utils/helper";

interface Props {
  activities: Activity[];
}

const ActivitiesDashBoard = ({ activities }: Props) => {
  const columns = ModelToColumns(activities[0], ["venue"]);
  const cellEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          options.editorCallback!(e.target.value)
        }
      />
    );
  };

  const onCellEditComplete = (e: ColumnEvent) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    if (newValue.trim().length > 0) rowData[field] = newValue;
    else event.preventDefault();
  };
  return (
    <>
      <DataTable
        value={activities}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[1, 5, 10, 25, 50]}
        editMode="cell"
        size="small"
      >
        {columns?.map(({ field, header }, index) => (
          <Column
            key={index}
            sortable
            field={field}
            header={header}
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          ></Column>
        ))}
      </DataTable>
    </>
  );
};

export default ActivitiesDashBoard;
