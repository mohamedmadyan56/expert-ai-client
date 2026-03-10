import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PortfolioItem {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    link?: string;
    createdAt: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const EXPERT_ID = '699356e3f370536ad14b30bd';
const API_BASE = 'http://localhost:5000/api/v1/portfolio';

const CATEGORY_COLORS: Record<string, string> = {
    Design: 'bg-orange-500',
    Development: 'bg-cyan-500',
    Marketing: 'bg-purple-500',
    Writing: 'bg-green-500',
    Other: 'bg-slate-500',
};

const CATEGORY_TEXT: Record<string, string> = {
    Design: 'text-orange-400',
    Development: 'text-cyan-400',
    Marketing: 'text-purple-400',
    Writing: 'text-green-400',
    Other: 'text-slate-400',
};

const CATEGORY_BORDER: Record<string, string> = {
    Design: 'border-orange-500',
    Development: 'border-cyan-500',
    Marketing: 'border-purple-500',
    Writing: 'border-green-500',
    Other: 'border-slate-500',
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);
//this line will return ["Design", "Development", "Marketing", "Writing", "Other"]
//because it will get the keys of the CATEGORY_COLORS object and keys is Design, Development, Marketing, Writing, Other





// ─── Main Page ────────────────────────────────────────────────────────────────
const PortfolioPage: React.FC = () => {
    const [works, setWorks] = useState<PortfolioItem[]>([]); //This is will return array of PortfolioItem objects
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Design');
    const [link, setLink] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [filter, setFilter] = useState('All');
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchPortfolio = async () => {
        try {
            setFetching(true);
            const res = await axios.get(API_BASE, { headers: { userid: EXPERT_ID } });
            setWorks(res.data.data);
        } catch {
            showToast('حدث خطأ أثناء جلب البيانات', 'error');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchPortfolio(); }, []);

    // ── Toast ──────────────────────────────────────────────────────────────────
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Image pick ─────────────────────────────────────────────────────────────
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!image) return showToast('من فضلك اختر صورة أولاً', 'error');

        setLoading(true);
        const fd = new FormData();
        fd.append('title', title);
        fd.append('description', description);
        fd.append('category', category);
        fd.append('image', image);
        if (link) fd.append('link', link);

        try {
            await axios.post(API_BASE, fd, {
                headers: { userid: EXPERT_ID, 'Content-Type': 'multipart/form-data' },
            });
            showToast('تمت إضافة العمل بنجاح ✓');
            setTitle(''); setDescription(''); setLink('');
            setImage(null); setPreview(null); setShowForm(false);
            fetchPortfolio();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'حدث خطأ أثناء الرفع', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_BASE}/${id}`, { headers: { userid: EXPERT_ID } });
            setWorks(prev => prev.filter(w => w._id !== id));
            showToast('تم حذف المشروع بنجاح');
        } catch {
            showToast('فشل الحذف، قد لا تملك الصلاحية', 'error');
        } finally {
            setDeleteId(null);
        }
    };

    const filtered = filter === 'All' ? works : works.filter(w => w.category === filter);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-slate-200" dir="rtl">

            {/* ── Toast ──────────────────────────────────────────────────────── */}
            {toast && (
                <div className={`fixed bottom-7 left-1/2 -translate-x-1/2 z-50 px-7 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap
          ${toast.type === 'success'
                        ? 'bg-green-950 border border-green-500 text-green-300'
                        : 'bg-red-950 border border-red-500 text-red-300'}`}
                >
                    {toast.msg}
                </div>
            )}

            {/* ── Delete Confirm ─────────────────────────────────────────────── */}
            {deleteId && (
                <div
                    className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-5"
                    onClick={() => setDeleteId(null)}
                >
                    <div
                        className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl p-8 max-w-sm w-full text-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-4xl text-amber-400 mb-3">⚠</div>
                        <h3 className="text-white text-lg font-bold mb-2">هل أنت متأكد؟</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            سيتم حذف هذا المشروع نهائياً ولا يمكن التراجع.
                        </p>
                        <div className="flex gap-3 justify-center mt-6">
                            <button
                                className="px-6 py-2.5 rounded-xl border border-[#2a2a3e] text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-all font-bold text-sm"
                                onClick={() => setDeleteId(null)}
                            >
                                إلغاء
                            </button>
                            <button
                                className="px-6 py-2.5 rounded-xl bg-red-950 border border-red-500 text-red-300 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                                onClick={() => handleDelete(deleteId)}
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Work Modal ─────────────────────────────────────────────── */}
            {showForm && (
                <div
                    className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-5"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-7 py-6 border-b border-[#1e1e2e]">
                            <h2 className="text-white font-bold text-lg">إضافة مشروع جديد</h2>
                            <button
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-[#1e1e2e] hover:text-white transition-all"
                                onClick={() => setShowForm(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-5">

                            {/* Upload */}
                            <div
                                className="border-2 border-dashed border-[#2a2a3e] rounded-xl min-h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-orange-500 transition-colors overflow-hidden"
                                onClick={() => fileRef.current?.click()}
                            >
                                {preview ? (
                                    <img src={preview} alt="preview" className="w-full h-48 object-cover" />
                                ) : (
                                    <>
                                        <span className="text-3xl text-slate-500">⬆</span>
                                        <span className="text-slate-400 text-sm">انقر لرفع صورة المشروع</span>
                                        <span className="text-slate-600 text-xs">PNG / JPG — حتى 5MB</span>
                                    </>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
                            </div>

                            {/* Title + Category */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-slate-400">عنوان المشروع *</label>
                                    <input
                                        type="text"
                                        placeholder="مثال: تطبيق إدارة المهام"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        required
                                        maxLength={100}
                                        className="bg-[#0a0a0f] border border-[#2a2a3e] rounded-xl text-slate-200 text-sm px-4 py-3 outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600 w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-slate-400">التصنيف *</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="bg-[#0a0a0f] border border-[#2a2a3e] rounded-xl text-slate-200 text-sm px-4 py-3 outline-none focus:border-orange-500 transition-colors w-full"
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c} className="bg-[#0f0f1a]">{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-400">وصف المشروع *</label>
                                <textarea
                                    placeholder="اوصف مشروعك باختصار..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                    rows={3}
                                    className="bg-[#0a0a0f] border border-[#2a2a3e] rounded-xl text-slate-200 text-sm px-4 py-3 outline-none focus:border-orange-500 transition-colors resize-none placeholder:text-slate-600 w-full"
                                />
                            </div>

                            {/* Link */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-400">رابط المشروع (اختياري)</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={link}
                                    onChange={e => setLink(e.target.value)}
                                    className="bg-[#0a0a0f] border border-[#2a2a3e] rounded-xl text-slate-200 text-sm px-4 py-3 outline-none focus:border-orange-500 transition-colors placeholder:text-slate-600 w-full"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end pt-1">
                                <button
                                    type="button"
                                    className="px-6 py-2.5 rounded-xl border border-[#2a2a3e] text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-all font-bold text-sm"
                                    onClick={() => setShowForm(false)}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br bg-[#1447E6] text-white font-bold text-sm shadow-lg  hover:-translate-y-0.5 hover:shadow-bg-[#1447E6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                            جاري الرفع...
                                        </>
                                    ) : 'نشر المشروع'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <header className="bg-gradient-to-b from-[#0f0f1a] to-[#0a0a0f] border-b border-[#1e1e2e] px-10 pt-7">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-7">
                    <div>
                        <div className="text-3xl font-black tracking-tight text-white">
                            expertly<span className="text-orange-500">.</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">معرض أعمالك الاحترافي</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br bg-[#1447E6] text-white font-bold shadow-lg  hover:-translate-y-0.5  transition-all"
                    >
                        <span className="text-xl leading-none">+</span>
                        إضافة مشروع
                    </button>
                </div>

                {/* Stats */}
                <div className="flex gap-8 flex-wrap pb-4 border-t border-[#1e1e2e] pt-4">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-orange-500">{works.length}</span>
                        <span className="text-xs text-slate-500">مشروع</span>
                    </div>
                    {CATEGORIES.map(cat => {
                        const count = works.filter(w => w.category === cat).length;
                        if (!count) return null;
                        return (
                            <div key={cat} className="flex items-baseline gap-1.5">
                                <span className={`text-2xl font-black ${CATEGORY_TEXT[cat]}`}>{count}</span>
                                <span className="text-xs text-slate-500">{cat}</span>
                            </div>
                        );
                    })}
                </div>
            </header>

            {/* ── Main ───────────────────────────────────────────────────────── */}
            <main className="px-10 py-8">

                {/* Filters */}
                <div className="flex gap-2.5 flex-wrap mb-8">
                    {['All', ...CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all
                ${filter === cat
                                    ? cat === 'All'
                                        ? 'border-orange-500 text-orange-500 font-bold'
                                        : `${CATEGORY_BORDER[cat]} ${CATEGORY_TEXT[cat]} font-bold`
                                    : 'border-[#2a2a3e] text-slate-500 hover:border-slate-500 hover:text-slate-200'
                                }`}
                        >
                            {cat === 'All' ? 'الكل' : cat}
                        </button>
                    ))}
                </div>

                {/* States */}
                {fetching ? (
                    <div className="flex flex-col items-center justify-center min-h-72 gap-4 text-slate-500">
                        <div className="w-10 h-10 border-4 border-[#1e1e2e] border-t-orange-500 rounded-full animate-spin" />
                        <p className="text-sm">جاري تحميل أعمالك...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-72 gap-3 text-center">
                        <div className="text-5xl text-[#2a2a3e]">◈</div>
                        <h3 className="text-slate-200 text-xl font-bold">لا توجد أعمال بعد</h3>
                        <p className="text-slate-500 text-sm mb-2">أضف أول مشروع لك وابدأ رحلتك!</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 transition-all"
                        >
                            + إضافة مشروع
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(item => (
                            <WorkCard key={item._id} item={item} onDelete={() => setDeleteId(item._id)} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

// ─── WorkCard ─────────────────────────────────────────────────────────────────
const WorkCard: React.FC<{ item: PortfolioItem; onDelete: () => void }> = ({ item, onDelete }) => {
    const badgeColor = CATEGORY_COLORS[item.category] || 'bg-slate-500';
    const hoverBorder = CATEGORY_BORDER[item.category] || 'hover:border-slate-500';

    return (
        <div className={`group bg-[#0f0f1a] border border-[#1e1e2e] ${hoverBorder} rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50`}>

            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-lg bg-white/10 border border-white/25 text-white text-sm font-bold backdrop-blur hover:bg-white/20 transition-colors"
                        >
                            ↗ عرض المشروع
                        </a>
                    )}
                </div>
                {/* Category badge */}
                <span className={`absolute top-3 right-3 ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {item.category}
                </span>
            </div>

            {/* Body */}
            <div className="p-5">
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1e1e2e]">
                    <span className="text-slate-600 text-xs">
                        {new Date(item.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric', month: 'short', day: 'numeric',
                        })}
                    </span>
                    <button
                        onClick={onDelete}
                        title="حذف"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2a2a3e] text-slate-500 text-xs hover:bg-red-950 hover:border-red-500 hover:text-red-400 transition-all"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;
