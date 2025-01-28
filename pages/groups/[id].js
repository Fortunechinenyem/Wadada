import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function GroupDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchGroup = async () => {
        try {
          const docRef = doc(db, "groups", id);
          const groupDoc = await getDoc(docRef);

          if (groupDoc.exists()) {
            setGroup({ id: groupDoc.id, ...groupDoc.data() });
          } else {
            console.error("Group not found");
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching group details:", error);
        }
      };

      fetchGroup();
    }
  }, [id]);

  if (loading) {
    return <div>Loading group details...</div>;
  }

  if (!group) {
    return <div>Group not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">{group.name}</h1>
      <p className="text-gray-600 mb-6">{group.description}</p>

      <h2 className="text-2xl font-medium mb-4">Members</h2>
      <ul className="list-disc list-inside space-y-2">
        {group.members.map((member) => (
          <li key={member.id} className="text-gray-700">
            {member.name}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-medium mt-8 mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        {group.activity.map((activity, index) => (
          <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}
