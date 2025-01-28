// import admin from "firebase-admin";
// import fs from "fs";
// import path from "path";
// import { getFunctions, httpsCallable } from "firebase/functions";

// const serviceAccountKey = JSON.parse(
//   fs.readFileSync(path.resolve("wadada", "serviceAccountKey.json"), "utf8")
// );

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccountKey),
//   });
// }

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { uid } = req.body;

//     if (!uid) {
//       return res.status(400).json({ error: "UID is required." });
//     }

//     try {
//       const functions = getFunctions();
//       const setAdminRole = httpsCallable(functions, "setAdminRole");
//       const response = await setAdminRole({ uid });

//       res.status(200).json({ message: response.data.message });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed." });
//   }
// }
