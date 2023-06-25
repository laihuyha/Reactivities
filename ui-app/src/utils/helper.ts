import constants from "./constanst";

export default function ModelToColumns(T: any, ignoreKeys?: string[]) {
    let columns = [];
    for (const key in T) {
        if (T.hasOwnProperty(key)) {
            let column = { field: key, header: key.charAt(0).toUpperCase() + key.slice(1) };
            columns.push(column);
        }
    }
    if (ignoreKeys) {
        ignoreKeys = ignoreKeys.concat(constants.ignoreId);
        return columns.filter(x => !ignoreKeys!.includes(x.field.toLowerCase()));
    }
    return columns.filter(x => !constants.ignoreId.includes(x.field.toLowerCase()));
}