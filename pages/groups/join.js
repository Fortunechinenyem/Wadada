// pages/groups/join.js
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function JoinGroup() {
  const [groupCode, setGroupCode] = useState("");
  const [publicGroups, setPublicGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = "user-id-placeholder";

  useEffect(() => {
    const fetchPublicGroups = async () => {
      try {
        const q = query(
          collection(db, "groups"),
          where("isPublic", "==", true)
        );
        const querySnapshot = await getDocs(q);

        const groups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPublicGroups(groups);
      } catch (error) {
        console.error("Error fetching public groups:", error);
      }
    };

    fetchPublicGroups();
  }, []);

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const q = query(collection(db, "groups"), where("code", "==", groupCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid group code. Please try again.");
      } else {
        const groupDoc = querySnapshot.docs[0];
        const groupRef = doc(db, "groups", groupDoc.id);

        const groupData = groupDoc.data();
        if (!groupData.members.some((member) => member.id === userId)) {
          await updateDoc(groupRef, {
            members: [...groupData.members, { id: userId, name: "Your Name" }], // Replace "Your Name" with actual user data
          });
          setSuccess("You have successfully joined the group!");
        } else {
          setError("You are already a member of this group.");
        }
      }
    } catch (error) {
      console.error("Error joining group by code:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPublicGroup = async (groupId) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(groupRef);
      const groupData = groupDoc.data();

      if (!groupData.members.some((member) => member.id === userId)) {
        await updateDoc(groupRef, {
          members: [...groupData.members, { id: userId, name: "Your Name" }], // Replace "Your Name" with actual user data
        });
        setSuccess("You have successfully joined the group!");
      } else {
        setError("You are already a member of this group.");
      }
    } catch (error) {
      console.error("Error joining public group:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Join a Group</h1>

      <form onSubmit={handleJoinByCode} className="mb-8">
        <h2 className="text-2xl font-medium mb-4">Join by Group Code</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter group code"
            className="p-2 border rounded-lg w-full"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </form>

      <h2 className="text-2xl font-medium mb-4">Browse Public Groups</h2>
      <ul className="space-y-4">
        {publicGroups.map((group) => (
          <li
            key={group.id}
            className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-700">{group.name}</h3>
              <p className="text-gray-600">{group.description}</p>
            </div>
            <button
              onClick={() => handleJoinPublicGroup(group.id)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
