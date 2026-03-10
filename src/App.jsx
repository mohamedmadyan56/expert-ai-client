import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ضفنا Navigate
import { useAuth } from "./context/AuthContext"; // ضفنا الـ Hook بتاعنا
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import About from "./components/About";
import ProfilePage from "./components/ProfilePage";
import ServicePage from "./components/ServicePage";
import PortfolioPage from "./components/PortfolioPage";

function App() {
  // بنجيب الـ user والـ loading من الـ Context مباشرة
  const { user, loading } = useAuth();

  // خطوة احترافية: لو الموقع لسه بيحمل بيانات المستخدم من الـ LocalStorage
  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* لو مش مسجل يدخل لوجن، لو مسجل يروح للهوم */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        {/* لو مش مسجل يدخل ساين أب، لو مسجل يروح للهوم */}
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

        {/* صفحة الشات محمية: لازم يكون فيه user */}
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/service"
          element={user ? <ServicePage /> : <Navigate to="/service" />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/portfolio"
          element={user ? <PortfolioPage /> : <Navigate to="/login" />}
        />
        {/* اختيار إضافي: أي لينك غلط يوديه للهوم */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
