const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can assign roles."
    );
  }

  const userId = data.userId;

  try {
    await admin.auth().setCustomUserClaims(userId, { role: "admin" });

    return { message: `User ${userId} is now an admin` };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
