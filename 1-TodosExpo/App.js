import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import Constants from "expo-constants";

// You can import from local files
import Todos from "./todos/Todos";
import AddTodo, { titleStyle } from "./todos/AddTodo";

const App = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const fetchData = () =>
    fetch("https://jsonplaceholder.typicode.com/todos", {
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());

  React.useEffect(() => {
    console.log("Effect");
    setLoading(true);
    fetchData()
      .then((serverData) => {
        console.log("Fetch");
        setData(serverData.slice(0, 20));
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleAddHandler = () => setIsAddOpen(!isAddOpen);

  const addTodoHandler = (title) => {
    const newData = [...data];
    let idMax = 0;
    data.forEach((todo) => {
      if (todo.id > idMax) idMax = todo.id;
    });
    newData.push({
      id: idMax + 1,
      title,
      completed: false,
    });
    setData(newData);
    toggleAddHandler();
  };

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

  const body = isAddOpen ? (
    <AddTodo onPress={addTodoHandler} />
  ) : (
    <ScrollView style={styles.paragraph}>
      <Todos todos={data} onTodoPress={toggleTodoHandler} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text style={[titleStyle, { flex: 1 }]}>Todo</Text>
        <Button
          title={isAddOpen ? "Cancel" : "Add"}
          onPress={toggleAddHandler}
        />
      </View>
      {loading ? <ActivityIndicator /> : body}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    //fontSize: 18,
    //fontWeight: 'bold',
    //textAlign: 'center',
    display: "flex",
    flexDirection: "column",
  },
});
