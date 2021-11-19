import React, { useContext } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { TodosContext } from "../data/TodosContext";
import Todos from "./Todos";

const TodosScreen: React.FC = () => {
  const { loading } = useContext(TodosContext);
  return loading ? (
    <View
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size={32} color="blue" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Todos />
    </ScrollView>
  );
};

export default TodosScreen;
