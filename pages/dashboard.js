import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FiLogOut,
  FiHome,
  FiUsers,
  FiSettings,
  FiPlusCircle,
  FiClock,
  FiTrendingUp,
  FiCreditCard,
} from "react-icons/fi";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [loans, setLoans] = useState([]);
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
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
        const contribRef = collection(db, "contributions");
        const contribQuery = query(contribRef, where("userId", "==", user.uid));
        const contribSnapshot = await getDocs(contribQuery);
        setContributions(
          contribSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const loanRef = collection(db, "loans");
        const loanQuery = query(loanRef, where("userId", "==", user.uid));
        const loanSnapshot = await getDocs(loanQuery);
        setLoans(
          loanSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    };

    fetchData();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`bg-blue-900 text-white w-64 p-5 transition-all ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Wadada</h2>
        <ul className="space-y-4">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg hover:text-blue-300"
            >
              <FiHome /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/groups"
              className="flex items-center gap-2 text-lg hover:text-blue-300"
            >
              <FiUsers /> My Groups
            </Link>
          </li>
          <li>
            <Link
              href="/groups/create"
              className="flex items-center gap-2 text-lg hover:text-blue-300"
            >
              <FiPlusCircle /> Create Group
            </Link>
          </li>
          <li>
            <Link
              href="/contributions"
              className="flex items-center gap-2 text-lg hover:text-blue-300"
            >
              <FiTrendingUp /> Contributions
            </Link>
          </li>
          <li>
            <Link
              href="/loans"
              className="flex items-center gap-2 text-lg hover:text-blue-300"
            >
              <FiCreditCard /> Loans
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center gap-2 text-lg hover:text-blue-300"
            >
              <FiSettings /> Settings
            </Link>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome, {user?.displayName || "User"} 👋
          </h1>
          <button
            onClick={logout}
            className="flex items-center px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-xl font-medium text-gray-700">Total Balance</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₦{totalBalance.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-medium text-gray-700">
              Scheduled Contributions
            </h3>
            <ul className="mt-3 text-gray-600">
              {contributions.length > 0 ? (
                contributions.map((contribution) => (
                  <li key={contribution.id}>
                    {contribution.amount} - {contribution.date}
                  </li>
                ))
              ) : (
                <p>No contributions yet.</p>
              )}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-xl font-medium text-gray-700">Active Loans</h3>
            <ul className="mt-3 text-gray-600">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <li key={loan.id}>
                    ₦{loan.amount} - Due: {loan.dueDate}
                  </li>
                ))
              ) : (
                <p>No active loans.</p>
              )}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-medium text-gray-700">My Groups</h3>
            <ul className="mt-3 space-y-2 text-gray-600">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <li
                    key={group.id}
                    className="flex justify-between items-center"
                  >
                    <Link
                      href={`/groups/${group.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {group.name}
                    </Link>
                    <span className="text-gray-500">
                      ₦{group.totalBalance.toLocaleString()}
                    </span>
                  </li>
                ))
              ) : (
                <p>No groups joined yet.</p>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-xl font-medium text-gray-700">Join a Group</h3>
            <Link
              href="/join-group"
              className="block w-full mt-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Join Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
