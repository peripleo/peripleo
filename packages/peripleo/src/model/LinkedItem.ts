export interface LinkedItem<T extends { [key: string]: any }, L extends Link = Link> {

  id: string;

  data: T;

  linkedTo: L[];

}

export interface Link<T extends unknown = string> {

  relation: T;

  linkedTo: string;

}
