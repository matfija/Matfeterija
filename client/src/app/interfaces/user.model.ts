export interface User {
  _id: string;
  alas: string;
  password: string;
  display?: string;
  description?: string;
  avatar?: string;
  following: string[] | User[];
  followers: string[] | User[];
}
