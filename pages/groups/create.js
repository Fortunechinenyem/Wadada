import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "groups"), {
        name,
        description,
        members: [],
        activity: [],
      });
      alert("Group created successfully!");
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Create a New Group</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Group Name
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded-lg mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}
