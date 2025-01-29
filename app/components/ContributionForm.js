import { contribute } from "@/pages/api/contribute";
import { useState } from "react";

export default function ContributionForm({ groupId, userId }) {
  const [amount, setAmount] = useState("");

  const handleContribute = async () => {
    if (!amount) return;

    const contributionAmount = Number(amount);
    if (contributionAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await contribute(groupId, userId, contributionAmount);
      if (response.success) {
        alert("Contribution successful!");
        setAmount("");
      } else {
        alert("Error making contribution");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700">
        Make a Contribution
      </h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mt-2 border rounded-lg"
        placeholder="Enter amount (₦)"
      />
      <button
        onClick={handleContribute}
        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Contribute
      </button>
    </div>
  );
}
