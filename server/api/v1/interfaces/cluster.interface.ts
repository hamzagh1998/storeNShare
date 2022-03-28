export interface Cluster<T> {
  name: string;
  shared: boolean;
  collections: Array<T>;
};