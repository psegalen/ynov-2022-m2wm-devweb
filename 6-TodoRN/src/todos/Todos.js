import * as React from "react";
import { TodosContext } from "../data/TodosContext";
import Todo from "./Todo";

const Todos = () => {
  const { todos, toggleTodo } = React.useContext(TodosContext);
  return todos.map((todo) => (
    <Todo
      todo={todo}
      key={todo.id}
      onPress={() => toggleTodo(todo.id)}
    />
  ));
};

export default Todos;
