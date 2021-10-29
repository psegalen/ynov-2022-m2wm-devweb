import * as React from "react";
import { Text, TouchableOpacity } from "react-native";

const viewStyle = {
  marginBottom: 16,
  padding: 8,
  borderWidth: 1,
  borderRadius: 8,
  borderColor: "black",
  backgroundColor: "#fff",
  alignSelf: "stretch",
};

const Todo = ({ todo, onPress }) => {
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
          textDecorationLine: todo.completed
            ? "line-through"
            : undefined,
        }}
      >
        {todo.title}
      </Text>
    </TouchableOpacity>
  );
};

export default Todo;
