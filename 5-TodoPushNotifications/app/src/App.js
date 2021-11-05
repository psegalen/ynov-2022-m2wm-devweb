import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { ActivityIndicator, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import TodosScreen from "./todos/TodosScreen";
import AddTodoScreen from "./todos/AddTodoScreen";
import ProfileScreen from "./user/ProfileScreen";
import AuthScreen from "./user/AuthScreen";
import { TodosContext } from "./data/TodosContext";
import { UserContext } from "./data/UserContext";

const TodoStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const App = () => {
  const { userId, userLoading, getLocalUser } =
    useContext(UserContext);
  const { fetchTodos } = useContext(TodosContext);

  React.useEffect(() => {
    const initialProcess = async () => {
      const user = await getLocalUser();
      if (user !== null) fetchTodos();
    };
    initialProcess();
  }, []);

  const TodoStackNav = () => (
    <TodoStack.Navigator>
      <TodoStack.Screen
        name="Home"
        options={({ navigation }) => ({
          title: "Accueil",
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("AddTodo")}
              title="Ajouter"
            />
          ),
        })}
        component={TodosScreen}
      />
      <TodoStack.Screen
        name="AddTodo"
        options={{ title: "Ajouter une Todo" }}
        component={AddTodoScreen}
      />
    </TodoStack.Navigator>
  );

  const ProfileStackNav = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        options={{
          title: "Profil",
        }}
        component={ProfileScreen}
      />
    </ProfileStack.Navigator>
  );

  const authenticatedBody = (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Todo") {
              iconName = focused
                ? "list-circle"
                : "list-circle-outline";
            } else if (route.name === "Profile") {
              iconName = focused
                ? "person-circle"
                : "person-circle-outline";
            }

            // You can return any component that you like here!
            return (
              <Ionicons name={iconName} size={size} color={color} />
            );
          },
        })}
      >
        <Tabs.Screen name="Todo" component={TodoStackNav} />
        <Tabs.Screen name="Profile" component={ProfileStackNav} />
      </Tabs.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );

  const body = userId ? authenticatedBody : <AuthScreen />;

  return userLoading ? <ActivityIndicator /> : body;
};

export default App;
