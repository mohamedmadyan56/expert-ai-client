import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTwitter,
  FaGithub,
  FaMapMarkerAlt,
  FaGlobe,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);

  // States للفورم
  const [formData, setFormData] = useState({
    name: "",
    headline: "",
    bio: "",
    location: "",
    twitterLink: "",
    gitHubLink: "",
    website: "",
    skills: [],
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/users/getMe",
          { withCredentials: true },
        );
        const userData = res.data.data.user;
        setUser(userData);
        setFormData({
          name: userData.name,
          headline: userData.headline || "",
          bio: userData.bio || "",
          location: userData.location || "",
          twitterLink: userData.twitterLink || "",
          gitHubLink: userData.gitHubLink || "",
          website: userData.website || "",
          skills: userData.skills || [],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // إضافة البيانات النصية
    Object.keys(formData).forEach((key) => {
      if (key === "skills") {
        formData.skills.forEach((s) => data.append("skills[]", s));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (photo) data.append("photo", photo);

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/v1/users/updateMe",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setUser(res.data.data.user);
      setIsEditing(false);
      setPhotoPreview(null);
      setPhoto(null);
      alert("Profile Updated! 🚀");
    } catch (err) {
      console.error("Update error:", err);
      alert("Update Failed!");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      headline: user.headline || "",
      bio: user.bio || "",
      location: user.location || "",
      twitterLink: user.twitterLink || "",
      gitHubLink: user.gitHubLink || "",
      website: user.website || "",
      skills: user.skills || [],
    });
    setIsEditing(false);
    setPhotoPreview(null);
    setPhoto(null);
    setNewSkill("");
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "from-purple-500 to-pink-600",
      expert: "from-amber-500 to-orange-600",
      user: "from-blue-500 to-cyan-600",
    };
    return colors[role] || colors.user;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-500 mx-auto mb-4"></div>
          <p className="text-violet-400 text-xl font-semibold">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.7s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-4 flex flex-col sm:flex-row justify-end items-center">
            <a 
              href="/portfolio" 
              className="group relative px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <FaCamera className="w-4 h-4" />
              My Portfolio
            </a>
        </div>
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-2"
              style={{ animation: "fadeIn 0.6s ease-out" }}
            >
              Profile Dashboard
            </h1>
            <p className="text-slate-400 text-lg">
              Manage your professional presence
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-semibold text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FaEdit className="inline-block w-5 h-5 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-slate-300 hover:bg-slate-700 transition-all duration-300"
              >
                <FaTimes className="inline-block w-5 h-5 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                <FaSave className="inline-block w-5 h-5 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          style={{ animation: "slideUp 0.8s ease-out" }}
        >
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')",
              }}
            ></div>
          </div>

          {/* Profile Content */}
          <div className="px-6 sm:px-10 pb-10 mt-22">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20 mb-8">
              <div className="relative group">
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
                  {photoPreview || user?.photo ? (
                    <img
                      src={
                        photoPreview ||
                        `http://localhost:5000/img/users/${user.photo}`
                      }
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-violet-400">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {isEditing && (
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaCamera className="w-8 h-8 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Role Badge */}
                <div
                  className={`absolute -bottom-2 -right-2 px-3 py-1.5 bg-gradient-to-r ${getRoleBadgeColor(
                    user?.role,
                  )} rounded-lg text-xs font-bold text-white shadow-lg uppercase tracking-wide`}
                >
                  {user?.role}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left mb-6 sm:mb-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="text-3xl sm:text-4xl font-bold text-white bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {user?.name}
                  </h2>
                )}

                <p className="text-slate-400 mb-3">{user?.email}</p>

                {isEditing ? (
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) =>
                      setFormData({ ...formData, headline: e.target.value })
                    }
                    maxLength={60}
                    className="text-lg bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-violet-500 text-white font-semibold"
                    placeholder="Your headline (e.g., Full Stack Developer)"
                  />
                ) : (
                  <p className="text-lg bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                    {user?.headline || "Add your headline"}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {user?.daysOnPlatform || 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Days Active
                  </div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {user?.skills?.length || 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Skills
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-3">
                About
              </h3>
              {isEditing ? (
                <div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    maxLength={150}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="text-right text-xs text-slate-500 mt-2">
                    {formData.bio?.length || 0}/150
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 leading-relaxed">
                  {user?.bio || "No bio added yet."}
                </p>
              )}
            </div>

            {/* Location & Links Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {/* Location */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Location
                  </h3>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="text-slate-300">
                    {user?.location || "Not specified"}
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <FaGlobe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Website
                  </h3>
                </div>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <a
                    href={user?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors break-all"
                  >
                    {user?.website || "Not specified"}
                  </a>
                )}
              </div>

              {/* Twitter */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <FaTwitter className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Twitter
                  </h3>
                </div>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.twitterLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        twitterLink: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="https://twitter.com/username"
                  />
                ) : (
                  <a
                    href={user?.twitterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                  >
                    {user?.twitterLink || "Not specified"}
                  </a>
                )}
              </div>

              {/* GitHub */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500/20 to-gray-500/20 flex items-center justify-center">
                    <FaGithub className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    GitHub
                  </h3>
                </div>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.gitHubLink}
                    onChange={(e) =>
                      setFormData({ ...formData, gitHubLink: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="https://github.com/username"
                  />
                ) : (
                  <a
                    href={user?.gitHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-300 transition-colors break-all"
                  >
                    {user?.gitHubLink || "Not specified"}
                  </a>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-4">
                Skills & Expertise
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {(isEditing ? formData.skills : user?.skills)?.map(
                  (skill, index) => (
                    <div
                      key={index}
                      className="group relative px-4 py-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-lg text-sm font-semibold text-violet-300 hover:from-violet-500/30 hover:to-fuchsia-500/30 transition-all duration-300"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="w-4 h-4 inline-block" />
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Add a new skill..."
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg font-semibold text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300"
                  >
                    <FaPlus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          Member since{" "}
          {new Date(
            Date.now() - (user?.daysOnPlatform || 0) * 24 * 60 * 60 * 1000,
          ).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
