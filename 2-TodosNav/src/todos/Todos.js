import * as React from "react";
import Todo from "./Todo";

const Todos = ({ todos, onTodoPress }) => {
  return todos.map((todo) => (
    <Todo todo={todo} key={todo.id} onPress={onTodoPress} />
  ));
};

export default Todos;
