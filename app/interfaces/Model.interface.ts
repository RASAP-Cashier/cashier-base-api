export type ModelWhere<T> = {
  [key in keyof T]?: T[key];
};

export type ModelWhereWithIn<T extends Record<string, any>> = {
  [key in keyof T]?: T[key] | T[key][];
};

export interface ModelRelation {
  relation: string;
  modifier?: string;
  relations?: ModelRelation[];
}
