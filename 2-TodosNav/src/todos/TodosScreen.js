import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import Todos from "./Todos";

const TodosScreen = ({ data, loading, setData }) => {
  const toggleTodoHandler = (todoId) => {
    const newData = data.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });
    setData(newData);
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Todos todos={data} onTodoPress={toggleTodoHandler} />
        </ScrollView>
      )}
    </View>
  );
};

export default TodosScreen;
