import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please fill all fields!");
        return;
      }

      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid email or password");
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("storage"));

      toast.success("Login successful!");

      setTimeout(() => {
        navigate(data.user.role === "corporation" ? "/corp/dashboard" : "/");
      }, 700);

    } catch (err) {
      console.error(err);
      toast.error("Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.12)]">

        <h2 className="text-3xl font-extrabold text-center text-teal-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Sign in to continue your journey
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition outline-none placeholder-gray-400"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition outline-none placeholder-gray-400"
              placeholder="Enter strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full text-white py-2.5 rounded-lg font-semibold transition shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 active:scale-[0.98]"
            }`}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-teal-700 font-semibold hover:underline hover:text-teal-800"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
