import { useEffect, useState } from "react";
import { getContributions } from "@/lib/contributions"; // Correct import path

export default function ContributionHistory({ groupId }) {
  const [contributions, setContributions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getContributions(groupId);
        setContributions(data);

        const total = data.reduce((sum, entry) => sum + entry.amount, 0);
        setTotalBalance(total);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      }
    }

    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700">Total Balance</h3>
      <p className="text-2xl font-bold text-green-500">
        ₦{totalBalance.toLocaleString()}
      </p>

      <h3 className="mt-6 text-xl font-semibold text-gray-700">
        Contribution History
      </h3>
      <ul className="mt-2 text-gray-600">
        {contributions.length > 0 ? (
          contributions.map((entry) => (
            <li key={entry.id} className="border-b py-2">
              {entry.userId}: ₦{entry.amount.toLocaleString()} -{" "}
              {new Date(entry.timestamp.seconds * 1000).toLocaleString()}
            </li>
          ))
        ) : (
          <p>No contributions yet.</p>
        )}
      </ul>
    </div>
  );
}
