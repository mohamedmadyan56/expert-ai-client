import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Bot, User, Loader2 } from "lucide-react";

function Chat() {
  const [prompt, setPrompt] = useState(""); // النص اللي اليوزر بيكتبه
  const [messages, setMessages] = useState([]); // مصفوفة الشات
  const [loading, setLoading] = useState(false); // حالة التحميل
  const scrollRef = useRef();

  // 1. جلب تاريخ المحادثة عند فتح الصفحة
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/v1/chat", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          setMessages(res.data.data.messages);
        }
      } catch (err) {
        console.error("فشل في تحميل تاريخ المحادثة:", err);
      }
    };
    fetchChatHistory();
  }, []); // [] تضمن التشغيل مرة واحدة فقط

  // 2. سكرول تلقائي لآخر رسالة عند إضافة أي رسالة جديدة
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. دالة إرسال الرسالة
  const handleSend = async () => {
    if (!prompt.trim()) return;

    // إضافة رسالة المستخدم فوراً للشاشة
    const userMsg = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const currentPrompt = prompt; // حفظ النص قبل المسح
    setPrompt("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/v1/chat", // نفس العنوان الموحد
        { message: currentPrompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // استلام رد الـ AI (الذي يحتوي على role و text)
      const aiMsg = response.data.data;
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = {
        role: "assistant",
        text: "عذراً، حدث خطأ في الاتصال بالسيرفر.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const userName = localStorage.getItem("userName");

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-gray-700 text-center text-xl font-bold bg-gray-800 shadow-md flex justify-center items-center gap-2">
        Expertly <span className="text-blue-500">AI</span>{" "}
        <Bot className="text-blue-500" />
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* رسالة ترحيب لو الشات فاضي */}
        {messages.length === 0 && !loading && (
          <div className="text-center mt-20 text-gray-400 italic">
            <h2 className="text-2xl mb-2">
              Hello{" "}
              <span className="text-blue-400 not-italic">
                {userName || "User"}
              </span>
            </h2>
            ابدأ المحادثة مع خبير الذكاء الاصطناعي...
          </div>
        )}

        {/* عرض الرسايل باستخدام map */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 rounded-tr-none flex-row"
                  : "bg-gray-800 border border-gray-700 rounded-tl-none flex-row-reverse"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap text-right text-sm md:text-base px-2">
                {msg.text}
              </p>
              <div className="mt-1 flex-shrink-0">
                {msg.role === "user" ? (
                  <User size={18} className="text-white" />
                ) : (
                  <Bot size={18} className="text-blue-400" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* علامة التحميل (Loading Pulse) */}
        {loading && (
          <div className="flex justify-start items-center text-gray-400 animate-pulse p-4">
            <Loader2 className="animate-spin ml-2" size={18} />
            <span className="text-sm italic">جاري التفكير...</span>
          </div>
        )}

        {/* Ref للسكرول التلقائي */}
        <div ref={scrollRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center bg-gray-900 rounded-full px-4 py-1 border border-gray-600 focus-within:border-blue-500 transition-all">
          <input
            className="flex-1 bg-transparent outline-none p-3 text-right text-white placeholder-gray-500"
            placeholder="اسأل خبيرك الآن..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition disabled:bg-gray-700"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Chat;
