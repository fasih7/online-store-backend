export type GenObject = Record<string, any>

export type MongoQueryObject = {query: GenObject, updateData: GenObject, options?: GenObject}