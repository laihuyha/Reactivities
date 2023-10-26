import constants from "./constanst"

const modelToColumns = (T: any, ignoreKeys?: string[]) => {
  const columns = []
  for (const key in T) {
    // eslint-disable-next-line no-prototype-builtins
    if (T.hasOwnProperty(key)) {
      const column = { field: key, header: key.charAt(0).toUpperCase() + key.slice(1) }
      columns.push(column)
    }
  }
  if (ignoreKeys) {
    ignoreKeys = ignoreKeys.concat(constants.ignoreId)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return columns.filter((x) => !ignoreKeys!.includes(x.field.toLowerCase()))
  }
  return columns.filter((x) => !constants.ignoreId.includes(x.field.toLowerCase()))
}

const convertTimeString = (timeString?: string) => {
  if (!timeString) return ""
  const newTimeString = timeString.slice(0, 4) + "/" + timeString.slice(4, 6) + "/" + timeString.slice(6, 8)
  return new Date(newTimeString)
}

const toDisplayDateTime = (timeString?: string, locale = "vi-VN", format?: Intl.DateTimeFormatOptions) => {
  if (!timeString) return ""
  const converted = convertTimeString(timeString) as Date
  return converted.toLocaleDateString(locale, format)
}

const toSimpleDateTime = (timeString?: string) => {
  if (!timeString) return ""
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timeString))
  const date = formatter.filter((x) => x.value !== "/" && x.value !== "-").map((x) => x.value)
  return date.reverse().join("")
}

const helper = {
  modelToColumns,
}

const dateTimeHelper = {
  convertTimeString,
  toDisplayDateTime,
  toSimpleDateTime,
}

export { helper, dateTimeHelper }
