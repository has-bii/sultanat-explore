import { format } from "date-fns"
import { id } from "date-fns/locale"

export const formatDateId = (date: string | number | Date, formatString: string = "PP") =>
  format(date, formatString, { locale: id })
