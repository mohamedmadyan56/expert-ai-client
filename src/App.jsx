import React, { useState } from "react";
import axios from "axios";
import { Send, Bot, User, Loader2 } from "lucide-react";
import "./index.css";
function App() {
  const [prompt, setPrompt] = useState(""); // لتخزين النص الي المستخدم بيكتبه في ال input
  const [messages, setMessages] = useState([]); //  ده بيكون عباره عن array بيكون فيه كل رسائل الشات
  const [loading, setLoading] = useState(false); // true >> السيرفر لسا بيرد لو false مفيش

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMsg = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setPrompt("");

    try {
      // ملحوظة: تأكد إن بورت السيرفر بتاعك 5000
      const response = await axios.post(
        "https://expert-ai-backend-production.up.railway.app/api/v1/ai",
        { prompt },
      );

      const aiMsg = { role: "ai", content: response.data.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = {
        role: "ai",
        content: "عذراً، حدث خطأ في الاتصال بالسيرفر.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-gray-700 text-center text-xl font-bold bg-gray-800 shadow-md">
        Expertly <span className="text-blue-500">AI</span>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.length === 0 && (
          <div className="text-center mt-30 text-gray-200 italic">
            ابدأ المحادثة مع خبير الذكاء الاصطناعي...
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === "user" ? "bg-blue-600 rounded-tr-none" : "bg-gray-800 border border-gray-700 rounded-tl-none"}`}
            >
              <div className="ml-3 mt-1 order-last sm:order-first">
                {msg.role === "user" ? (
                  <User size={18} />
                ) : (
                  <Bot size={18} className="text-blue-400" />
                )}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-right text-sm md:text-base px-2">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center text-gray-400 animate-pulse">
            <Loader2 className="animate-spin ml-2" size={18} />
            <span className="text-sm">جاري التفكير...</span>
          </div>
        )}
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
            className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition disabled:bg-gray-600"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
