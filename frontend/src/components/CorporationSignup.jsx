import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CorporationSignup = () => {
  const [formData, setFormData] = useState({
    corporationName: "",
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
    const { corporationName, email, city, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: corporationName,
          email,
          city,
          password,
          role: "corporation",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Corporation signup successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-teal-800 text-center mb-6">
          Corporation Registration
        </h2>
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Corporation Name
            </label>
            <input
              type="text"
              name="corporationName"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-600 outline-none"
              placeholder="Enter corporation name"
              value={formData.corporationName}
              onChange={handleChange}
              required
            />
          </div>

          {["email", "city", "password", "confirmPassword"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium mb-2 capitalize">
                {field === "confirmPassword" ? "Confirm Password" : field}
              </label>
              <input
                type={
                  field.includes("password") ? "password" : field === "email" ? "email" : "text"
                }
                name={field}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-600 outline-none"
                placeholder={`Enter your ${field}`}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-teal-700 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CorporationSignup;
