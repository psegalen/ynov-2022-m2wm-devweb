const admin = require("firebase-admin");
const functions = require("firebase-functions");

const getTodo = (response, todoId) => {
  const todosCollection = admin.firestore().collection("todos");

  todosCollection
    .doc(todoId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        response.status(404).send("Not found");
      } else {
        response.send(doc.data());
      }
    });
};

const createTodo = (response, todoId, body) => {
  const todosCollection = admin.firestore().collection("todos");

  todosCollection
    .doc(todoId)
    .set(body)
    .then(() =>
      response.send(Object.assign({}, { id: todoId }, body))
    )
    .catch((err) => {
      functions.logger.error("Create Todo failed!", { error: err });
      response.status(500).send(err);
    });
};

const updateTodo = (response, todoId, body) => {
  const todosCollection = admin.firestore().collection("todos");

  todosCollection
    .doc(todoId)
    .set(body, { merge: true })
    .then(() => {
      todosCollection
        .doc(todoId)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            response.status(404).send("Not found");
          } else {
            response.send(doc.data());
          }
        });
    })
    .catch((err) => {
      functions.logger.error("Update Todo failed!", { error: err });
      response.status(500).send(err);
    });
};

const deleteTodo = (response, todoId) => {
  const todosCollection = admin.firestore().collection("todos");

  todosCollection
    .doc(todoId)
    .delete()
    .then(() => response.send("Deleted"))
    .catch((err) => {
      functions.logger.error("Delete Todo failed!", { error: err });
      response.status(500).send(err);
    });
};

const handleTodoRequest = (request, response) => {
  const todoId = request.query.todoId;
  const body = request.body;
  if (!todoId) response.status(400).send("Not allowed");
  else {
    switch (request.method) {
      case "GET":
        // Send back the todo
        getTodo(response, todoId);
        break;
      case "POST":
        // Create the todo
        createTodo(response, todoId, body);
        break;
      case "PATCH":
        // Update the todo
        updateTodo(response, todoId, body);
        break;
      case "DELETE":
        // Delete the todo
        deleteTodo(response, todoId);
        break;
      default:
        response.status(400).send("Not allowed");
        break;
    }
  }
};

module.exports = handleTodoRequest;
