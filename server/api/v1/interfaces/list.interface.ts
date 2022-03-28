export interface List<T> {
  name: string;
  shared: boolean;
  items: Array<T>;
};