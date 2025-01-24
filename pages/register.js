import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-md p-6 bg-white rounded shadow"
        onSubmit={handleRegister}
      >
        <h2 className="text-xl font-bold text-center mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
