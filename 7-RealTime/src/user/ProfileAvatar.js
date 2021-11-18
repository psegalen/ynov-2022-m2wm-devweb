import React, { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../data/UserContext";

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

  return await getDownloadURL(result.ref);
}

const ProfileAvatar = () => {
  const { userData, updateAvatar } = useContext(UserContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      try {
        const url = await uploadImageAsync(result.uri, result.type);
        console.log(url);
        updateAvatar(url);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
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
  );
};

export default ProfileAvatar;
