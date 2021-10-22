import * as React from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";

const rootStyle = {
  display: "flex",
  flex: 1,
  marginTop: 8,
};

export const titleStyle = {
  fontSize: 24,
  fontWeight: "bold",
};

const inputStyle = {
  borderWidth: 1,
  borderRadius: 4,
  padding: 8,
};

const margedView = { marginTop: 8 };

const AddTodo = ({ onPress }) => {
  const [title, setTitle] = React.useState("");
  const onButtonPress = () => {
    if (title.length === 0) {
      Alert.alert("Merci d'entrer un titre !");
    } else {
      onPress(title);
    }
  };
  return (
    <View style={rootStyle}>
      <Text style={titleStyle}>Add Todo</Text>
      <View style={margedView}>
        <TextInput
          style={inputStyle}
          value={title}
          onChangeText={(txt) => setTitle(txt)}
        />
      </View>
      <View style={margedView}>
        <Button onPress={onButtonPress} title="Add this Todo!" />
      </View>
    </View>
  );
};

export default AddTodo;
