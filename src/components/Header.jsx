import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform duration-300">
              E
            </div>
            <span className="text-xl font-bold tracking-tight">
              Expertly<span className="text-blue-500">AI</span>
            </span>
          </Link>

          {/* Center Navigation - Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-blue-400" : "text-slate-300 hover:text-white"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-blue-400" : "text-slate-300 hover:text-white"}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-blue-400" : "text-slate-300 hover:text-white"}`
              }
            >
              Solutions
            </NavLink>
            <NavLink
              to="/service"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-blue-400" : "text-slate-300 hover:text-white"}`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-blue-400" : "text-slate-300 hover:text-white"}`
              }
            >
              Portfolio
            </NavLink>
          </nav>

          {/* Right Section - Auth / User Profile */}
          <nav className="flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-semibold transition shadow-lg shadow-blue-500/20"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/chat"
                  className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Dashboard
                </Link>

                {/* Vertical Divider */}
                <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>

                {/* User Avatar & Logout */}
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center">
                    <img
                      src={
                        user.photo
                          ? `http://localhost:5000/img/users/${user.photo}`
                          : `https://ui-avatars.com/api/?name=${user.name}`
                      }
                      className="w-8 h-8 rounded-full object-cover border border-slate-600 hover:border-blue-500 hover:scale-110 transition-all duration-300 shadow-sm"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${user.name}`;
                      }}
                      alt="Profile"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-400 hover:text-red-300 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
