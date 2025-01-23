import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FiLogOut } from "react-icons/fi";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
            <Link href="#" className="text-lg hover:text-blue-400">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="text-lg hover:text-blue-400">
              Transactions
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="text-lg hover:text-blue-400">
              Settings
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="text-lg hover:text-blue-400">
              Support
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome, {user?.email}
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
            <h3 className="text-xl font-medium text-gray-700">Balance</h3>
            <p className="text-2xl font-bold text-green-500 mt-2">₦50,000.00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">
              Recent Transactions
            </h3>
            <ul className="mt-2 text-gray-600">
              <li>Payment to XYZ - ₦5,000.00</li>
              <li>Deposit from ABC - ₦20,000.00</li>
              <li>Withdrawal to Bank - ₦3,000.00</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">
              Account Settings
            </h3>
            <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
