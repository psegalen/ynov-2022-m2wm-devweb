const admin = require("firebase-admin");
const functions = require("firebase-functions");

const getUser = (response, userId) => {
  const usersCollection = admin.firestore().collection("users");

  usersCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        response.status(404).send("Not found");
      } else {
        response.send(doc.data());
      }
    });
};

const updateUser = (response, userId, body) => {
  const usersCollection = admin.firestore().collection("users");

  usersCollection
    .doc(userId)
    .set(body, { merge: true })
    .then(() => {
      usersCollection
        .doc(userId)
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

const handleUserRequest = (request, response) => {
  const userId = request.query.userId;
  const body = request.body;
  if (!userId) response.status(400).send("Not allowed");
  else {
    switch (request.method) {
      case "GET":
        // Send back the user
        getUser(response, userId);
        break;
      case "PATCH":
        // Update the user
        updateUser(response, userId, body);
        break;
      default:
        response.status(400).send("Not allowed");
        break;
    }
  }
};

module.exports = handleUserRequest;
