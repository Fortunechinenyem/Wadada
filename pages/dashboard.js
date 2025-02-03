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
  FiMenu,
} from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const data = [
  { name: "Group A", balance: 4000 },
  { name: "Group B", balance: 3000 },
  { name: "Group C", balance: 2000 },
];
export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
  >
    {darkMode ? "🌙" : "☀️"}
  </button>;
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
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 p-2 bg-blue-900 text-white rounded-lg md:hidden z-50"
      >
        <FiMenu className="w-6 h-6" />
      </button>
      <div
        className={`${
          darkMode ? "dark" : ""
        } flex h-screen bg-gray-100 dark:bg-gray-900`}
      >
        <aside
          className={`bg-blue-900 dark:bg-blue-800  text-white w-64 p-5 transition-all fixed md:relative h-full ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
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

        <main className="flex-1 p-8 text-gray-800 dark:text-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="  transform hover:scale-105 transition-transform"
            >
              <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-lg shadow-md  ">
                <h3 className="text-xl font-medium ">Total Balance</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ₦{totalBalance.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-lg shadow-md ">
                <h3 className="text-xl font-medium ">
                  Scheduled Contributions
                </h3>
                <ul className="mt-3 ">
                  {contributions.length > 0 ? (
                    contributions.map((contribution) => (
                      <li
                        key={contribution.id}
                        className="flex justify-between"
                      >
                        <span>₦{contribution.amount}</span>
                        <span>{contribution.date}</span>
                      </li>
                    ))
                  ) : (
                    <p>No contributions yet.</p>
                  )}
                </ul>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="  transform hover:scale-105 transition-transform"
            >
              <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-6 rounded-lg shadow-md ">
                <h3 className="text-xl font-medium ">Active Loans</h3>
                <ul className="mt-3 text-gray-600">
                  {loans.length > 0 ? (
                    loans.map((loan) => (
                      <li key={loan.id} className="flex justify-between">
                        <span>₦{loan.amount}</span>
                        <span>Due: {loan.dueDate}</span>
                      </li>
                    ))
                  ) : (
                    <p>No active loans.</p>
                  )}
                </ul>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="  transform hover:scale-105 transition-transform"
            >
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
            </motion.div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-xl font-medium text-gray-700">
                Join a Group
              </h3>
              <Link
                href="/join-group"
                className="block w-full mt-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Join Now
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium mb-4">Group Balances</h3>
              <BarChart width={500} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="balance" fill="#4F46E5" />
              </BarChart>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
