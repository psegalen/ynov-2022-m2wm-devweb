import React from "react";
import App from "./App";
import { TodosProvider } from "./data/TodosContext";
import { UserProvider } from "./data/UserContext";

const Root = () => {
  return (
    <UserProvider>
      <TodosProvider>
        <App />
      </TodosProvider>
    </UserProvider>
  );
};

export default Root;
