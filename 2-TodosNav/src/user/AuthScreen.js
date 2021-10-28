import React from "react";
import { Button, Text, TextInput, View } from "react-native";

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

const AuthScreen = ({ setUser }) => {
  return (
    <View style={rootStyle}>
      <Text style={{ fontSize: 24, marginBottom: 32 }}>
        Authentification
      </Text>
      <Text>Login</Text>
      <TextInput style={inputStyle} />
      <Text>Mot de passe</Text>
      <TextInput style={inputStyle} secureTextEntry />
      <Button
        title="S'authentifier"
        onPress={() => setUser("utilisateur")}
      />
    </View>
  );
};

export default AuthScreen;
