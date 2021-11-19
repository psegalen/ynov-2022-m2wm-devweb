export interface Todo {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
}

export interface User {
  name?: string;
  avatar?: string;
  token?: string;
}
