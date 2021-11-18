import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import React, { useContext, useRef } from "react";
import { ActivityIndicator, Button, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import TodosScreen from "./todos/TodosScreen";
import AddTodoScreen from "./todos/AddTodoScreen";
import ProfileScreen from "./user/ProfileScreen";
import AuthScreen from "./user/AuthScreen";
import { TodosContext } from "./data/TodosContext";
import { UserContext } from "./data/UserContext";
import fetchHelper from "./data/fetchHelper";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.error("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

const TodoStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const App = () => {
  const { userId, userLoading, getLocalUser } =
    useContext(UserContext);
  const { fetchTodos } = useContext(TodosContext);
  const responseListener = useRef();

  React.useEffect(() => {
    if (userId !== null && !responseListener.current) {
      registerForPushNotificationsAsync().then((token) => {
        console.log(token);
        fetchHelper.updateTokenForUser(userId, token);
      });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(
          (response) => {
            console.log(response);
            if (
              response.notification.request.content.data.navigateTo
            ) {
              // TODO : navigate to the given page
              console.log(
                `We must navigate to: ${response.notification.request.content.data.navigateTo}`
              );
            }
          }
        );
    }
    if (userId === null && responseListener.current) {
      Notifications.removeNotificationSubscription(
        responseListener.current
      );
    }

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, [userId]);

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
