import React, { useEffect } from "react";
import {
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ user, signOut, avatar, setAvatar }) => {
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

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
        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              backgroundColor: "#888",
              borderRadius: 100,
              width: 200,
              height: 200,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{
                  borderRadius: 100,
                  width: 200,
                  height: 200,
                }}
              />
            ) : (
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 48,
                  color: "#fff",
                }}
              >
                ?
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 32,
          }}
        >
          Nom : {user}
        </Text>
        <Button title="Se déconnecter" onPress={signOut} />
      </View>
    </View>
  );
};

export default ProfileScreen;
