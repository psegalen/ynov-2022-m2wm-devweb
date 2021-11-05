import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import fetchHelper from "./fetchHelper";
import { UserContext } from "./UserContext";

const initialTodos = {
  todos: [],
  loading: false,
  fetchTodos: () => {},
  addTodo: () => {},
  toggleTodo: () => {},
};

export const TodosContext = createContext(initialTodos);

export const TodosProvider = ({ children }) => {
  const { userId } = useContext(UserContext);
  const [todos, setTodos] = useState([]);
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

  const addTodo = async (title) => {
    const newData = [...todos];
    const todoId = uuidv4();
    const todo = {
      id: todoId,
      title,
      completed: false,
      userId,
    };
    newData.push(todo);
    setTodos(newData);
    fetchHelper.createTodo(todo);
  };

  const toggleTodo = (todoId) => {
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
