import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import fetchHelper from "./fetchHelper";
import { Todo } from "./todoTypes";
import { UserContext } from "./UserContext";

interface TodosContextType {
  todos: Todo[];
  loading: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (todoId: string) => void;
}

const initialTodos: TodosContextType = {
  todos: [],
  loading: false,
  fetchTodos: () => Promise.resolve(),
  addTodo: () => Promise.resolve(),
  toggleTodo: () => {},
};

export const TodosContext = createContext(initialTodos);

export const TodosProvider: React.FC = ({ children }) => {
  const { userId } = useContext(UserContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const serverData = await fetchHelper.getTodos();
      setTodos(serverData);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (title: string) => {
    if (userId) {
      const newData = [...todos];
      let todoId: string;
      try {
        todoId = uuidv4();
      } catch (e) {
        // uuid can break on Expo
        todoId = (Math.random() * 1000000000).toFixed(0);
      }
      const todo: Todo = {
        id: todoId,
        title,
        completed: false,
        userId,
      };
      newData.push(todo);
      setTodos(newData);
      fetchHelper.createTodo(todo);
    }
  };

  const toggleTodo = (todoId: string) => {
    let newCompleted = false;
    const newData = todos.map((todo) => {
      if (todo.id === todoId) {
        newCompleted = !todo.completed;
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });
    setTodos(newData);
    fetchHelper.updateCompletedForTodo(todoId, newCompleted);
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        loading,
        fetchTodos,
        addTodo,
        toggleTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
