import { useEffect, useState } from "react";
import Link from "next/link";

import { useRouter } from "next/router";

import { collection, getDocs } from "firebase/firestore";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import AdminRoleSetter from "../../app/components/AdminRoleSetter";

export default function AdminPanel() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    platformBalance: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // useEffect(() => {
  //   if (!loading && (!user || user.role !== "admin")) {
  //     router.push("/login");
  //   }
  // }, [user, loading, router]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const transactionsSnapshot = await getDocs(
          collection(db, "transactions")
        );

        const totalUsers = usersSnapshot.size;
        const totalTransactions = transactionsSnapshot.size;

        const platformBalance = transactionsSnapshot.docs.reduce(
          (sum, doc) => sum + doc.data().amount,
          0
        );

        setMetrics({
          totalUsers,
          totalTransactions,
          platformBalance,
        });
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      }
    };

    fetchMetrics();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-4 border-gray-200 border-solid"></div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li className="mb-4">
            <Link href="/admin" className="text-lg hover:text-blue-400">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/users" className="text-lg hover:text-blue-400">
              Users
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/admin/transactions"
              className="text-lg hover:text-blue-400"
            >
              Transactions
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Admin Dashboard
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
            <h3 className="text-xl font-medium text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {metrics.totalUsers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">
              Total Transactions
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {metrics.totalTransactions}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">
              Platform Balance
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              ₦{metrics.platformBalance.toLocaleString()}
            </p>
          </div>
        </div>
        <AdminRoleSetter />
      </div>
    </div>
  );
}
