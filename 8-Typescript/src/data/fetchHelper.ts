import { Todo, User } from "./todoTypes";

const fetchHelper = {
  getTodos: async (): Promise<Todo[]> =>
    fetch("https://europe-west1-ynov-todos.cloudfunctions.net/todos", {
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json()),
  createTodo: async (todo: Todo): Promise<Todo> =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/todo?todoId=${todo.id}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ ...todo }),
      }
    ).then((response) => response.json()),
  updateCompletedForTodo: async (
    todoId: string,
    newCompleted: boolean
  ): Promise<Todo> =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/todo?todoId=${todoId}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify({ completed: newCompleted }),
      }
    ).then((response) => response.json()),
  getUser: async (userId: string): Promise<User> =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/user?userId=${userId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    ).then((response) => response.json()),
  updateAvatarForUser: async (userId: string, avatar: string): Promise<User> =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/user?userId=${userId}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify({ avatar }),
      }
    ).then((response) => response.json()),
  updateTokenForUser: async (userId: string, token: string): Promise<User> =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/user?userId=${userId}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify({ token }),
      }
    ).then((response) => response.json()),
};

export default fetchHelper;
