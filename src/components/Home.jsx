import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Home = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQueries: 0,
    aiModelsActive: 5,
    serverUptime: "99.9%",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/stats");
        if (res.data.status === "success") {
          setStats(res.data.data);
        }
      } catch (err) {
        console.log("Error loading stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white flex flex-col items-center px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[120px]"></div>

      {/* Hero Section - الجزء العلوي */}
      <div className="max-w-4xl text-center relative z-10 pt-24 md:pt-32 mb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent italic">
          Your Intelligent AI Companion.
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          Experience the next generation of conversation with Expertly AI. Get
          instant answers, creative inspiration, and expert-level advice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={user ? "/chat" : "/signup"}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-500/25"
          >
            {user ? "Continue to Chat" : "Start For Free"}
          </Link>
          <button className="px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-2xl font-bold text-lg transition-all">
            See How it Works
          </button>
        </div>

        {/* مميزات سريعة (Fast, Secure, Smart) */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 text-slate-500 text-sm font-medium">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white text-xl">⚡ Fast</span>
            Instant Responses
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white text-xl">🔒 Secure</span>
            End-to-end Encrypted
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <span className="text-white text-xl">🧠 Smart</span>
            GPT-4 Powered
          </div>
        </div>
      </div>

      {/* --- القسم الجديد: إحصائيات الباك إيند في آخر الصفحة --- */}
      <div className="w-full max-w-5xl mt-auto mb-12 relative z-10 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-slate-800/60 bg-gradient-to-b from-transparent to-slate-900/30 rounded-b-3xl">
          {/* User Stat */}
          <div className="text-center group cursor-default transition-all duration-300 hover:-translate-y-2">
            <div className="text-2xl font-bold text-blue-500 transition-colors group-hover:text-blue-400 group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              {stats.totalUsers}+
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 group-hover:text-slate-300 transition-colors">
              Users
            </div>
          </div>

          {/* Queries Stat */}
          <div className="text-center border-l border-slate-800/50 group cursor-default transition-all duration-300 hover:-translate-y-2">
            <div className="text-2xl font-bold text-purple-500 transition-colors group-hover:text-purple-400 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              {stats.totalQueries.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 group-hover:text-slate-300 transition-colors">
              Queries
            </div>
          </div>

          {/* Models Stat */}
          <div className="text-center border-l border-slate-800/50 group cursor-default transition-all duration-300 hover:-translate-y-2">
            <div className="text-2xl font-bold text-green-500 transition-colors group-hover:text-green-400 group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
              {stats.aiModelsActive}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 group-hover:text-slate-300 transition-colors">
              Models
            </div>
          </div>

          {/* Uptime Stat */}
          <div className="text-center border-l border-slate-800/50 group cursor-default transition-all duration-300 hover:-translate-y-2">
            <div className="text-2xl font-bold text-orange-500 transition-colors group-hover:text-orange-400 group-hover:drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
              {stats.serverUptime}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 group-hover:text-slate-300 transition-colors">
              Uptime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
