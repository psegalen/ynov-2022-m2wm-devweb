import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  View,
} from "react-native";
import authHelper from "../data/authHelper";
import { TodosContext } from "../data/TodosContext";
import { UserContext } from "../data/UserContext";

const rootStyle = {
  display: "flex",
  flexDirection: "column",
  padding: 64,
  alignItems: "center",
};

const inputStyle = {
  borderWidth: 1,
  borderRadius: 4,
  padding: 8,
  backgroundColor: "#fff",
  width: "100%",
  marginBottom: 32,
};

const AuthScreen = () => {
  const { fetchTodos } = useContext(TodosContext);
  const { signUserIn } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const user = await authHelper.signInOnFirebase(email, password);
      await signUserIn(user);
      fetchTodos();
    } catch (err) {
      Alert.alert("Erreur", err.message);
    }
  };
  return (
    <View style={rootStyle}>
      <Text style={{ fontSize: 24, marginBottom: 32 }}>
        Authentification
      </Text>
      <Text>Email</Text>
      <TextInput
        style={inputStyle}
        value={email}
        onChangeText={(txt) => setEmail(txt)}
      />
      <Text>Mot de passe</Text>
      <TextInput
        style={inputStyle}
        secureTextEntry
        value={password}
        onChangeText={(txt) => setPassword(txt)}
      />
      {loading ? (
        <ActivityIndicator size={32} color="blue" />
      ) : (
        <Button title="S'authentifier" onPress={signIn} />
      )}
    </View>
  );
};

export default AuthScreen;
