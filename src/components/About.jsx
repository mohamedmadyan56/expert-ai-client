import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
const About = () => {
  const [aboutData, setAboutData] = useState(null);
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/stats/about-info",
        );
        setAboutData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16 relative overflow-hidden">
      {/* الخلفية الجمالية (نفس روح الـ Home) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px]"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* --- القسم القديم (المهمة والرؤية) --- */}
        <section className="text-center mb-20">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-slate-500 bg-clip-text text-transparent italic">
            Behind Expertly AI
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            We believe that artificial intelligence should be accessible,
            intuitive, and human-centric. Our mission is to bridge the gap
            between complex technology and everyday solutions.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* --- القسم القديم (قيم المنصة) --- */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-blue-500">Why We Exist</h2>
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
                <h3 className="text-xl font-bold mb-2">🚀 Innovation</h3>
                <p className="text-slate-400 text-sm">
                  Constantly evolving with the latest GPT models to provide
                  cutting-edge intelligence.
                </p>
              </div>
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
                <h3 className="text-xl font-bold mb-2">🔒 Privacy</h3>
                <p className="text-slate-400 text-sm">
                  Your data is yours. We prioritize security and encryption in
                  every conversation.
                </p>
              </div>
            </div>
          </div>

          {/* --- القسم الجديد (البيانات الحية من الباك إيند) --- */}
          <div className="bg-slate-900/60 border border-blue-500/20 p-8 rounded-3xl backdrop-blur-md shadow-2xl shadow-blue-500/5">
            <h2 className="text-xl font-semibold mb-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Live Community Pulse
            </h2>

            <div className="space-y-6">
              {aboutData ? (
                aboutData.latestUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                          New Member
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 italic bg-slate-800/50 px-3 py-1 rounded-full">
                      {moment(user.createdAt).fromNow()}
                    </span>
                  </div>
                ))
              ) : (
                /* Skeleton Loader أثناء التحميل */
                <div className="animate-pulse space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
                        <div className="h-4 w-24 bg-slate-800 rounded"></div>
                      </div>
                      <div className="h-3 w-16 bg-slate-800 rounded"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {aboutData && (
              <div className="mt-10 pt-6 border-t border-slate-800 text-center">
                <p className="text-slate-400 text-sm">
                  Join{" "}
                  <span className="text-white font-bold text-lg mx-1">
                    {aboutData.totalUser}
                  </span>
                  pioneers already shaping the future.
                </p>
                <button className="mt-4 text-blue-500 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
                  View Full Roadmap →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
