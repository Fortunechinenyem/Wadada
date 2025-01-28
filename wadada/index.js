const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  const { uid } = data;
  try {
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    return { message: `User with UID: ${uid} is now an admin.` };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// const admin = require("firebase-admin");
// const functions = require("firebase-functions");

// const serviceAccount = require("./path/to/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const setAdminRole = async (uid) => {
//   try {

//     await admin.auth().setCustomUserClaims(uid, { role: "admin" });
//     console.log(`User with UID: ${uid} is now an admin.`);
//   } catch (error) {
//     console.error("Error setting admin role:", error);
//   }
// };

// // Replace 'exampleAdminUID' with the UID of the user you want to promote
// setAdminRole("rK1fwXLosWfFtYYzLQPRr3pb7");

// exports.setAdminRole = functions.https.onCall(async (data, context) => {
//   if (context.auth.token.role !== "superadmin") {
//     throw new functions.https.HttpsError(
//       "permission-denied",
//       "Only superadmins can assign admin roles"
//     );
//   }

//   const uid = data.uid;
//   await admin.auth().setCustomUserClaims(uid, { role: "admin" });

//   return { message: `Admin role assigned to user ${uid}` };
// });

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// admin.initializeApp();

// exports.setAdminRole = functions.https.onCall(async (data, context) => {
//   if (!context.auth || context.auth.token.role !== "admin") {
//     throw new functions.https.HttpsError(
//       "permission-denied",
//       "Only admins can assign roles."
//     );
//   }

//   const userId = data.userId;

//   try {
//     await admin.auth().setCustomUserClaims(userId, { role: "admin" });

//     return { message: `User ${userId} is now an admin` };
//   } catch (error) {
//     throw new functions.https.HttpsError("internal", error.message);
//   }
// });
