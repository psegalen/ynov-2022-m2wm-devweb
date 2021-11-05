const admin = require("firebase-admin");
const axios = require("axios");

const sendNotificationToUsers = () => {
  const usersCollection = admin.firestore().collection("users");

  usersCollection.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.token) {
        // Send a push!
        axios.default
          .post("https://exp.host/--/api/v2/push/send", {
            to: data.token,
            title: "Ping !",
            body: "Hello !",
          })
          .then(() => console.log("Sent!"));
      }
    });
  });
};

module.exports = sendNotificationToUsers;
