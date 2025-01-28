import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        const groupsRef = collection(db, "groups");
        const q = query(
          groupsRef,
          where("members", "array-contains", user.uid)
        );
        const snapshot = await getDocs(q);

        const groupsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const total = groupsData.reduce(
          (sum, group) => sum + (group.totalBalance || 0),
          0
        );

        setGroups(groupsData);
        setTotalBalance(total);
      }
    };

    fetchGroups();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-4 border-gray-200 border-solid"></div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Wadada</h2>
        <ul>
          <li className="mb-4">
            <Link href="/dashboard" className="text-lg hover:text-blue-400">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/groups" className="text-lg hover:text-blue-400">
              My Groups
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/groups/create" className="text-lg hover:text-blue-400">
              Create Group
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/settings" className="text-lg hover:text-blue-400">
              Settings
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome, {user?.displayName || "User"}
          </h1>
          <button
            onClick={logout}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">Total Balance</h3>
            <p className="text-2xl font-bold text-green-500 mt-2">
              ₦{totalBalance.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">My Groups</h3>
            <ul className="mt-2 text-gray-600">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <li key={group.id} className="mb-2">
                    <Link
                      href={`/groups/${group.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {group.name} - ₦{group.totalBalance.toLocaleString()}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No groups joined yet.</li>
              )}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">Join a Group</h3>
            <Link
              href="/join-group"
              className="block w-full mt-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
