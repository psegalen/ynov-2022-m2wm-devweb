const functions = require("firebase-functions");
const admin = require("firebase-admin");
const getTodos = require("./todos.js");
const handleTodoRequest = require("./todo.js");
const handleUserRequest = require("./user.js");

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions
  .region("europe-west1")
  .https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
  });

exports.todos = functions
  .region("europe-west1")
  .https.onRequest(getTodos);

exports.todo = functions
  .region("europe-west1")
  .https.onRequest(handleTodoRequest);

exports.user = functions
  .region("europe-west1")
  .https.onRequest(handleUserRequest);
