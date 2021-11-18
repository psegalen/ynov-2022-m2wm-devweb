import React, { useContext, useEffect } from "react";
import { Button, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../data/UserContext";
import ProfileAvatar from "./ProfileAvatar";

const ProfileScreen = () => {
  const { userData, signUserOut } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(
          "L'app n'accède à vos photos que pour définir votre avatar."
        );
      }
    })();
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <View
        style={{
          padding: 32,
          borderRadius: 8,
          borderWidth: 1,
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ProfileAvatar />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 32,
          }}
        >
          Nom : {userData.name}
        </Text>
        <Button title="Se déconnecter" onPress={signUserOut} />
      </View>
    </View>
  );
};

export default ProfileScreen;
