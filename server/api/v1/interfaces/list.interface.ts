export interface List<T> {
  collectionParent: T;
  name: string;
  shared: boolean;
  items?: Array<T>;
};