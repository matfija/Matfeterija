import { User } from './user.model';

export interface Post {
  _id: string;
  user: User;
  title: string;
  content: string;
  date: string;
  likes: string[];
  topics: string[];
  comms: number;
}
