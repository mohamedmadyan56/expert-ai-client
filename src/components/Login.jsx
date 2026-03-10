import React, { useState } from "react";
// ...existing code...
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      if (response.data.token) {
        login(response.data.data.user, response.data.login);
        navigate("/chat");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-950 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center text-white">
            Welcome Back
          </h2>
          <p className="text-center text-slate-400 text-sm">
            {" "}
            Login to access Expertly AI{" "}
          </p>
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                type="email"
                required
                value={email}
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                type="password"
                required
                value={password}
                placeholder="************"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
