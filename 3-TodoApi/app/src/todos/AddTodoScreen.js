import * as React from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";

const rootStyle = {
  display: "flex",
  flex: 1,
  marginTop: 8,
  padding: 16,
};

export const titleStyle = {
  fontSize: 24,
  fontWeight: "bold",
};

const inputStyle = {
  borderWidth: 1,
  borderRadius: 4,
  padding: 8,
  backgroundColor: "#fff",
};

const margedView = { marginTop: 8 };

const AddTodoScreen = ({ onPress, navigation }) => {
  const [title, setTitle] = React.useState("");
  const onButtonPress = () => {
    if (title.length === 0) {
      Alert.alert("Merci d'entrer un titre !");
    } else {
      onPress(title);
      navigation.goBack();
    }
  };
  return (
    <View style={rootStyle}>
      <View style={margedView}>
        <TextInput
          style={inputStyle}
          value={title}
          onChangeText={(txt) => setTitle(txt)}
        />
      </View>
      <View style={margedView}>
        <Button
          onPress={onButtonPress}
          title="Ajouter cette Todo !"
        />
      </View>
    </View>
  );
};

export default AddTodoScreen;
