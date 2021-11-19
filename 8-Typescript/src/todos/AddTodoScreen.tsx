import * as React from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  ViewStyle,
  StyleProp,
  TextStyle,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TodosContext } from "../data/TodosContext";
import { TodoParamList } from "../App";

const rootStyle: StyleProp<ViewStyle> = {
  display: "flex",
  flex: 1,
  marginTop: 8,
  padding: 16,
};

export const titleStyle: StyleProp<TextStyle> = {
  fontSize: 24,
  fontWeight: "bold",
};

const inputStyle: StyleProp<TextStyle> = {
  borderWidth: 1,
  borderRadius: 4,
  padding: 8,
  backgroundColor: "#fff",
};

const margedView: StyleProp<ViewStyle> = { marginTop: 8 };

const AddTodoScreen: React.FC<
  NativeStackScreenProps<TodoParamList, "AddTodo">
> = ({ navigation }) => {
  const { addTodo } = React.useContext(TodosContext);
  const [title, setTitle] = React.useState("");
  const onButtonPress = () => {
    if (title.length === 0) {
      Alert.alert("Merci d'entrer un titre !");
    } else {
      addTodo(title);
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
        <Button onPress={onButtonPress} title="Ajouter cette Todo !" />
      </View>
    </View>
  );
};

export default AddTodoScreen;
