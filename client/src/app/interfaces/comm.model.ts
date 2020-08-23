import { User } from './user.model';

export interface Comm {
  _id: string;
  user: User;
  post: string;
  content: string;
  date: string;
  likes: string[];
}
