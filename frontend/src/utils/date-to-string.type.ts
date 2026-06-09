export type DateToString<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}

export type DeepDateToString<T> = T extends Date
  ? string
  : T extends Array<infer U>
    ? Array<DeepDateToString<U>>
    : T extends object
      ? { [K in keyof T]: DeepDateToString<T[K]> }
      : T
