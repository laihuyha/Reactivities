export default function ModelToColumns(T: any) {
    let columns = [];
    for (const key in T) {
        if (T.hasOwnProperty(key)) {
            let column = { field: key, header: key.charAt(0).toUpperCase() + key.slice(1) };
            columns.push(column);
        }
    }
    return columns;
}