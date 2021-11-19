import * as React from "react";
import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Todo } from "../data/todoTypes";

const viewStyle: StyleProp<ViewStyle> = {
  marginBottom: 16,
  padding: 8,
  borderWidth: 1,
  borderRadius: 8,
  borderColor: "black",
  backgroundColor: "#fff",
  alignSelf: "stretch",
};

interface TodoProps {
  todo: Todo;
  onPress: (todoId: string) => void;
}

const TodoComponent: React.FC<TodoProps> = ({ todo, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        viewStyle,
        todo.completed
          ? { borderColor: "gray", backgroundColor: "#eee" }
          : undefined,
      ]}
      onPress={() => onPress(todo.id)}
    >
      <Text
        style={{
          color: todo.completed ? "gray" : "black",
          textDecorationLine: todo.completed ? "line-through" : undefined,
        }}
      >
        {todo.title}
      </Text>
    </TouchableOpacity>
  );
};

export default TodoComponent;
