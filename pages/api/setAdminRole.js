import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import serviceAccount from "../../wadada/serviceAccountKey.json";
import { getFunctions, httpsCallable } from "firebase/functions";

const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("wadada", "serviceAccountKey.json"), "utf8")
);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "UID is required." });
    }

    try {
      const functions = getFunctions();
      const setAdminRole = httpsCallable(functions, "setAdminRole");
      const response = await setAdminRole({ uid });

      res.status(200).json({ message: response.data.message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}

// import { getFunctions, httpsCallable } from "firebase/functions";
// const serviceAccount = require("./path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const functions = getFunctions();
// const addAdminRole = httpsCallable(functions, "addAdminRole");

// addAdminRole({ uid: "rK1fwXLosWfFtYYzLQPRr3pb" })
//   .then((result) => console.log(result.data.message))
//   .catch((error) => console.error(error));
//   const admin = require("firebase-admin");

// const setAdminRole = async (uid) => {
//   try {

//     await admin.auth().setCustomUserClaims(uid, { role: "admin" });
//     console.log(User with UID: ${uid} is now an admin.);
//   } catch (error) {
//     console.error("Error setting admin role:", error);
//   }
// };

// setAdminRole("osWfFtYYzLQPRr3pb");
