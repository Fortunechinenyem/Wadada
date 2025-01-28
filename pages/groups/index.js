import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const snapshot = await getDocs(collection(db, "groups"));
        const groupData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(groupData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <div>Loading groups...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">My Groups</h1>
      <ul className="space-y-4">
        {groups.map((group) => (
          <li
            key={group.id}
            className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200"
          >
            <Link
              href={`/groups/${group.id}`}
              className="text-xl font-bold text-blue-600"
            >
              {group.name}
            </Link>
            <p className="text-gray-600 mt-2">{group.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
