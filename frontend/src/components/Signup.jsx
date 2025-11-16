import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, city, password, confirmPassword } = formData;

    if (!name || !email || !city || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, city, password, role: "user" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast.success("Account created successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.12)]">

        <h2 className="text-3xl font-extrabold text-center text-teal-900 mb-2">
          Create User Account
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Join us and help make lives better 🐾
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          {["name", "email", "city", "password", "confirmPassword"].map((field) => (
            <div key={field}>
              <label className="block font-medium text-gray-700 mb-1 capitalize">
                {field === "confirmPassword" ? "Confirm Password" : field}
              </label>
              <input
                type={
                  field.includes("password")
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                name={field}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none transition placeholder-gray-400"
                placeholder={`Enter ${field === "confirmPassword" ? "password again" : field}`}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2.5 rounded-lg font-semibold transition shadow-lg
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 active:scale-[0.98]"}`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Want to register a corporation?{" "}
          <Link to="/corporation-signup" className="text-teal-700 font-semibold hover:underline hover:text-teal-800">
            Click Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
