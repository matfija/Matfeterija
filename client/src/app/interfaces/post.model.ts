import { User } from './user.model';

export interface Post {
  _id: string;
  user: string | User;
  title: string;
  content: string;
  date: string;
}
