export interface User<T> {
  username: string;
  email: string;
  password: string;
  avatar: string;
  cluster?: T;
  favorites?: Array<T>;
};