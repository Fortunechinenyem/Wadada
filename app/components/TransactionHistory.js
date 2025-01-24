import { useState, useEffect } from "react";

import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const fetchTransactions = async (isNext = true) => {
    setLoading(true);

    try {
      const transactionsRef = collection(db, "transactions");
      let q = query(transactionsRef, orderBy("date", "desc"), limit(pageSize));

      if (!isNext && lastVisible) {
        q = query(transactionsRef, orderBy("date", "asc"), limit(pageSize));
      } else if (lastVisible) {
        q = query(
          transactionsRef,
          orderBy("date", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setPage(isNext ? page + 1 : page - 1);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-medium text-gray-700">Transaction History</h3>

      {loading && <p>Loading transactions...</p>}

      {!loading && transactions.length === 0 && (
        <p className="text-gray-500 mt-4">No transactions found.</p>
      )}

      <ul className="mt-4">
        {transactions.map((txn) => (
          <li key={txn.id} className="mb-2 text-gray-600">
            <div>
              <span className="font-bold">{txn.description}</span> - ₦
              {txn.amount}
            </div>
            <div className="text-sm text-gray-400">
              {new Date(txn.date).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button
          disabled={loading || page === 1}
          onClick={() => fetchTransactions(false)}
          className={`px-4 py-2 text-white rounded-lg ${
            page === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <button
          disabled={loading || transactions.length < pageSize}
          onClick={() => fetchTransactions(true)}
          className={`px-4 py-2 text-white rounded-lg ${
            transactions.length < pageSize
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
