import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const USERS_PER_PAGE = 5;

  const fetchUsers = async (
    nextPage = false,
    searchValue = "",
    statusValue = ""
  ) => {
    setLoading(true);
    setError("");

    try {
      let usersQuery;

      if (searchValue) {
        usersQuery = query(
          collection(db, "users"),
          where("name", ">=", searchValue),
          where("name", "<=", searchValue + "\uf8ff"),
          orderBy("name"),
          limit(USERS_PER_PAGE)
        );
      } else if (statusValue) {
        usersQuery = query(
          collection(db, "users"),
          where("status", "==", statusValue),
          orderBy("registeredAt", "desc"),
          limit(USERS_PER_PAGE)
        );
      } else {
        usersQuery = nextPage
          ? query(
              collection(db, "users"),
              orderBy("registeredAt", "desc"),
              startAfter(lastVisible),
              limit(USERS_PER_PAGE)
            )
          : query(
              collection(db, "users"),
              orderBy("registeredAt", "desc"),
              limit(USERS_PER_PAGE)
            );
      }

      const snapshot = await getDocs(usersQuery);

      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(nextPage ? [...users, ...usersData] : usersData);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(false, search.trim(), "");
  };

  const handleFilter = (status) => {
    setStatusFilter(status);
    fetchUsers(false, "", status);
  };

  const handleDeactivate = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        status: currentStatus === "active" ? "inactive" : "active",
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: currentStatus === "active" ? "inactive" : "active",
              }
            : user
        )
      );
    } catch (err) {
      setError("Failed to update user status.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Users Management
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-wrap gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="px-4 py-2 border rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>
        <div>
          <button
            onClick={() => handleFilter("")}
            className={`px-4 py-2 mr-2 rounded ${
              statusFilter === "" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilter("active")}
            className={`px-4 py-2 mr-2 rounded ${
              statusFilter === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleFilter("inactive")}
            className={`px-4 py-2 rounded ${
              statusFilter === "inactive"
                ? "bg-red-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-6 py-3 text-gray-600">Name</th>
            <th className="px-6 py-3 text-gray-600">Email</th>
            <th className="px-6 py-3 text-gray-600">Status</th>
            <th className="px-6 py-3 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDeactivate(user.id, user.status)}
                  className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length >= USERS_PER_PAGE && (
        <button
          onClick={() => fetchUsers(true, search, statusFilter)}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Load More
        </button>
      )}

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}
    </div>
  );
}
