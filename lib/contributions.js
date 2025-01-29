import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const getContributions = async (groupId) => {
  try {
    const contributionsRef = collection(db, "groups", groupId, "contributions");
    const q = query(contributionsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return [];
  }
};
