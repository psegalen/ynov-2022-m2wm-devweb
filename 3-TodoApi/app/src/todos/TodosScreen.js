import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import fetchHelper from "../data/fetchHelper";
import Todos from "./Todos";

const TodosScreen = ({ data, loading, setData }) => {
  let newCompleted = false;
  const toggleTodoHandler = (todoId) => {
    const newData = data.map((todo) => {
      if (todo.id === todoId) {
        newCompleted = !todo.completed;
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });
    setData(newData);
    fetchHelper.updateCompletedForTodo(todoId, newCompleted);
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
