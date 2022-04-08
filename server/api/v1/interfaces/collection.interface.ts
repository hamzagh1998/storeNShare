export interface Collection<T> {
  clusterParent: T;
  name: string;
  shared: boolean;
  lists?: Array<T>;
};