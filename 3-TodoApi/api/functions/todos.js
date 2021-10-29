const admin = require("firebase-admin");

const getTodos = (request, response) => {
  if (request.method !== "GET") {
    response.status(400).send("Not allowed");
  }

  const todosCollection = admin.firestore().collection("todos");

  todosCollection.get().then((snapshot) => {
    const result = [];
    snapshot.forEach((doc) =>
      result.push(Object.assign({}, { id: doc.id }, doc.data()))
    );
    response.send(result);
  });
};

module.exports = getTodos;
