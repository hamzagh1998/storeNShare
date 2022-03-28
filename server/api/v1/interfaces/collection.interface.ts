export interface Collection<T> {
  name: string;
  shared: boolean;
  lists: Array<T>;
};