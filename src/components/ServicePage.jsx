import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ إعداد Axios مع credentials
  const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
  });

  // --- 1) جلب الخدمات (Read) ---
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/services/all");
      setServices(response.data.data.services);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err.response?.data?.message || "فشل في جلب الخدمات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // --- 2) مسح خدمة (Delete) ---
  const deleteService = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;

    try {
      await api.delete(`/services/delete/${id}`);
      setServices(services.filter((s) => s._id !== id));
      alert("✅ تم حذف الخدمة بنجاح");
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("❌ " + (err.response?.data?.message || "فشل في حذف الخدمة"));
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        <h2 className="mt-6 text-2xl font-bold text-purple-700">
          جاري التحميل...
        </h2>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-3">❌ حدث خطأ</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={fetchServices}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            🔄 إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // --- Empty State ---
  if (services.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-6xl mb-6">📦</div>
        <h2 className="text-3xl font-bold text-purple-700 mb-2">
          لا توجد خدمات متاحة
        </h2>
        <p className="text-gray-600 text-lg">كن أول من يضيف خدمة!</p>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            🚀 كل الخدمات المتاحة
          </h1>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold text-lg">
            {services.length} خدمة
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-2"
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold">
                    {service.category}
                  </span>

                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-yellow-300">⭐</span>
                    <span className="font-bold">{service.ratingsAverage}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold group-hover:text-purple-100 transition-colors">
                  {service.title}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[60px] line-clamp-3">
                  {service.description}
                </p>

                {/* Price & Delivery Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-purple-600 font-medium mb-1">
                      السعر
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      ${service.price}
                    </p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-indigo-600 font-medium mb-1">
                      التسليم
                    </p>
                    <p className="text-2xl font-bold text-indigo-700">
                      {service.deliveryTime}d
                    </p>
                  </div>
                </div>

                {/* Rating Details */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="font-bold text-gray-800">
                    {service.ratingsAverage}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({service.ratingsQuantity} تقييم)
                  </span>
                </div>

                {/* Expert Info */}
                {service.expert && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {service.expert.name?.charAt(0).toUpperCase() || "E"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {service.expert.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {service.expert.headline || "خبير"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                    ✏️ تعديل
                  </button>
                  <button
                    onClick={() => deleteService(service._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  تم الإنشاء في{" "}
                  {new Date(service.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;
