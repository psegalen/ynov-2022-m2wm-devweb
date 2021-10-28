import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodosScreen from "./src/todos/TodosScreen";
import AddTodoScreen from "./src/todos/AddTodoScreen";
import ProfileScreen from "./src/user/ProfileScreen";
import AuthScreen from "./src/user/AuthScreen";

const TodoStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const USER_STORAGE_KEY = "USER_STORAGE_KEY";
const AVATAR_STORAGE_KEY = "AVATAR_STORAGE_KEY";

const App = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [userLoading, setUserLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);

  const fetchData = () =>
    fetch("https://jsonplaceholder.typicode.com/todos", {
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());

  const fetchAndSetData = async () => {
    try {
      const serverData = await fetchData();
      setData(serverData.slice(0, 20));
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    const initialProcess = async () => {
      try {
        const storageUser = await AsyncStorage.getItem(
          USER_STORAGE_KEY
        );
        if (storageUser) {
          // User is authenticated
          setUser(storageUser);
          fetchAndSetData();
          const storageAvatar = await AsyncStorage.getItem(
            AVATAR_STORAGE_KEY
          );
          setAvatar(storageAvatar);
        } else {
          // User is anonymous
        }
        setUserLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    initialProcess();
  }, []);

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
  };

  const signOut = () => {
    AsyncStorage.removeItem(USER_STORAGE_KEY);
    AsyncStorage.removeItem(AVATAR_STORAGE_KEY);
    setUser(null);
  };

  const setAvatarFromProfile = (newAvatar) => {
    setAvatar(newAvatar);
    AsyncStorage.setItem(AVATAR_STORAGE_KEY, newAvatar);
  };

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
      >
        {(props) => (
          <TodosScreen
            {...props}
            data={data}
            loading={loading}
            setData={setData}
          />
        )}
      </TodoStack.Screen>
      <TodoStack.Screen
        name="AddTodo"
        options={{ title: "Ajouter une Todo" }}
      >
        {(props) => (
          <AddTodoScreen {...props} onPress={addTodoHandler} />
        )}
      </TodoStack.Screen>
    </TodoStack.Navigator>
  );

  const ProfileStackNav = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        options={{
          title: "Profil",
        }}
      >
        {(props) => (
          <ProfileScreen
            {...props}
            user={user}
            signOut={signOut}
            avatar={avatar}
            setAvatar={setAvatarFromProfile}
          />
        )}
      </ProfileStack.Screen>
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

  const setUserAndFetchData = (newUser) => {
    AsyncStorage.setItem(USER_STORAGE_KEY, newUser);
    setUser(newUser);
    fetchAndSetData();
  };

  const unauthenticatedBody = (
    <AuthScreen setUser={setUserAndFetchData} />
  );

  const body = user ? authenticatedBody : unauthenticatedBody;

  return userLoading ? <ActivityIndicator /> : body;
};

export default App;
