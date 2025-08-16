export interface IUser {
  _id: string;
  name: string;
  role: {
    _id: string;
    name: string;
  };
}
