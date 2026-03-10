import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // استورد الـ Hook
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const { login } = useAuth(); // جبنا دالة الـ login من الـ Context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/signup",
        formData,
      );

      if (response.data.status === "success" || response.data.token) {
        // 1. بدلاً من localStorage يدوي، بنادي على دالة الـ login من الـ Context
        // هي هتحفظ الـ Token والـ User وتخلي الـ App كله يعرف
        login(response.data.data.user, response.data.token);

        // 2. حول المستخدم لصفحة الشات فوراً
        navigate("/chat");
      }
    } catch (error) {
      console.error(
        "خطأ في التسجيل:",
        error.response?.data?.message || error.message,
      );
      alert(
        "فشل التسجيل: " +
          (error.response?.data?.message || "تأكد من صحة البيانات"),
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">
          إنشاء حساب جديد
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="الاسم بالكامل"
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
            onChange={(e) =>
              setFormData({ ...formData, passwordConfirm: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg"
          >
            إنشاء حساب
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
