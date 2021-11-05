const fetchHelper = {
  getTodos: async () =>
    fetch(
      "https://europe-west1-ynov-todos.cloudfunctions.net/todos",
      {
        headers: { "Content-Type": "application/json" },
      }
    ).then((response) => response.json()),
  createTodo: async (todo) =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/todo?todoId=${todo.id}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ ...todo }),
      }
    ).then((response) => response.json()),
  updateCompletedForTodo: async (todoId, newCompleted) =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/todo?todoId=${todoId}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify({ completed: newCompleted }),
      }
    ).then((response) => response.json()),
  getUser: async (userId) =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/user?userId=${userId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    ).then((response) => response.json()),
  updateAvatarForUser: async (userId, avatar) =>
    fetch(
      `https://europe-west1-ynov-todos.cloudfunctions.net/user?userId=${userId}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify({ avatar }),
      }
    ).then((response) => response.json()),
};

export default fetchHelper;
