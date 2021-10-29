import React, { useEffect } from "react";
import {
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

async function uploadImageAsync(uri, type) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const storage = getStorage();
  const fileRef = ref(
    storage,
    `${uuidv4()}.${type === "image/png" ? "png" : "jpg"}`
  );
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  const url = await getDownloadURL(result.ref);

  return url;
}

const ProfileScreen = ({ userData, signOut, changeAvatarUrl }) => {
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

  const uploadImage = async (imgUri, type) => {
    try {
      const url = await uploadImageAsync(imgUri, type);
      console.log(url);
      changeAvatarUrl(url);
    } catch (err) {
      console.log(err);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImage(result.uri, result.type);
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
            {userData.avatar ? (
              <Image
                source={{ uri: userData.avatar }}
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
          Nom : {userData.name}
        </Text>
        <Button title="Se déconnecter" onPress={signOut} />
      </View>
    </View>
  );
};

export default ProfileScreen;
