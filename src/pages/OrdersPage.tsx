import { useState, useEffect } from "react";
import { storage } from "../lib/storage";
import { Order, STORAGE_KEYS, OrderStatus, Rating } from "../types";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Clock, MapPin, RefreshCw, Star, ChevronRight, MessageSquareQuote } from "lucide-react";
import { cn, formatCurrency, generateId } from "../lib/utils";

interface OrdersPageProps {
  role: "user" | "kantin";
}

export default function OrdersPage({ role }: OrdersPageProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"aktif" | "riwayat">("aktif");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRatingModalFor, setShowRatingModalFor] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [existingRatings, setExistingRatings] = useState<Rating[]>([]);

  const refreshOrders = () => {
    setIsRefreshing(true);
    const allOrders = storage.get<Order>(STORAGE_KEYS.ORDERS);
    const filtered = allOrders.filter(o => role === "user" ? o.userId === user?.id : o.kantinId === user?.id);
    setOrders(filtered.sort((a, b) => new Date(b.waktuPesan).getTime() - new Date(a.waktuPesan).getTime()));
    setExistingRatings(storage.get<Rating>(STORAGE_KEYS.RATINGS));
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    refreshOrders();
  }, [user, role]);

  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const allOrders = storage.get<Order>(STORAGE_KEYS.ORDERS);
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = nextStatus;
      storage.set(STORAGE_KEYS.ORDERS, allOrders);
      refreshOrders();
    }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case "Menunggu Konfirmasi": return "Sedang Disiapkan";
      case "Sedang Disiapkan": return "Siap Diambil";
      case "Siap Diambil": return "Selesai";
      default: return null;
    }
  };

  const submitRating = (order: Order) => {
    const newRating: Rating = {
      id: generateId(),
      userId: user!.id,
      kantinId: order.kantinId,
      orderId: order.id,
      bintang: ratingValue,
    };
    const ratings = storage.get<Rating>(STORAGE_KEYS.RATINGS);
    ratings.push(newRating);
    storage.set(STORAGE_KEYS.RATINGS, ratings);
    setShowRatingModalFor(null);
    refreshOrders();
  };

  const isOrderRated = (orderId: string) => {
    return existingRatings.some(r => r.orderId === orderId);
  };

  const activeOrders = orders.filter(o => o.status !== "Selesai");
  const historyOrders = orders.filter(o => o.status === "Selesai");
  const displayOrders = activeTab === "aktif" ? activeOrders : historyOrders;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900 leading-none tracking-tighter uppercase">Status Pesanan</h1>
          <p className="text-slate-500 mt-3 font-medium">Lacak dan kelola riwayat transaksi makanan kamu hari ini.</p>
        </div>
        <button
          onClick={refreshOrders}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white px-5 py-3 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-500 hover:text-emerald-600 uppercase tracking-widest transition-all shadow-sm group active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={cn("text-emerald-500 group-hover:rotate-180 transition-transform duration-500", isRefreshing && "animate-spin")} />
          Refresh
        </button>
      </header>

      <div className="flex bg-white p-1 rounded-lg border border-slate-200 w-fit shadow-sm">
        <button
          onClick={() => setActiveTab("aktif")}
          className={cn(
            "px-8 py-2.5 rounded text-[10px] font-semibold uppercase tracking-widest transition-all duration-300",
            activeTab === "aktif" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-emerald-500"
          )}
        >
          Aktif ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("riwayat")}
          className={cn(
            "px-8 py-2.5 rounded text-[10px] font-semibold uppercase tracking-widest transition-all duration-300",
            activeTab === "riwayat" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-emerald-500"
          )}
        >
          Riwayat ({historyOrders.length})
        </button>
      </div>

      <div className="grid gap-8">
        {displayOrders.map((order) => (
          <motion.div
            layout
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-50/50"
          >
            <div className="bg-slate-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center font-semibold text-emerald-600 border border-slate-200 text-xs italic">
                    {order.kantinNama.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1 block">{order.id}</span>
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-tight">{role === "user" ? order.kantinNama : `PEMESAN: ${storage.findOne<any>(STORAGE_KEYS.USERS, u => u.id === order.userId)?.name || 'Mahasiswa'}`}</h3>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{new Date(order.waktuPesan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className={cn(
                      "px-3 py-1 rounded text-[9px] font-semibold uppercase tracking-wider italic border",
                      order.status === "Selesai" ? "bg-slate-800 text-white border-transparent" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  )}>
                    {order.status}
                  </div>
               </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-semibold text-slate-400">x{item.quantity}</div>
                          <span className="text-xs font-semibold text-slate-700 uppercase tracking-widest">{item.nama}</span>
                       </div>
                       <span className="text-xs font-semibold text-slate-900">{formatCurrency(item.harga * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                {order.catatan && (
                  <div className="flex gap-3 p-4 bg-emerald-50 rounded-lg border border-dashed border-emerald-200 text-emerald-700">
                     <MessageSquareQuote size={14} className="shrink-0 mt-0.5" />
                     <p className="text-[10px] font-semibold uppercase tracking-widest italic leading-relaxed">"{order.catatan}"</p>
                  </div>
                )}
              </div>

              <div className="lg:w-72 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Proses Pesanan</span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3].map((idx) => {
                      const statuses = ["Menunggu Konfirmasi", "Sedang Disiapkan", "Siap Diambil", "Selesai"];
                      const currentIdx = statuses.indexOf(order.status);
                      return (
                        <div key={idx} className={cn("h-1.5 flex-1 rounded-full", idx <= currentIdx ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-slate-100")} />
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <div className="flex justify-between items-end mb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total Belanja</span>
                        <p className="text-2xl font-semibold text-slate-900 tracking-tighter uppercase leading-none">{formatCurrency(order.totalHarga)}</p>
                      </div>
                   </div>
                   
                   {role === "kantin" && order.status !== "Selesai" && (
                    <button
                      onClick={() => {
                        const next = getNextStatus(order.status);
                        if (next) updateOrderStatus(order.id, next);
                      }}
                      className="w-full bg-slate-900 text-white py-4 rounded-lg text-[10px] font-semibold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      Update Status
                      <ChevronRight size={14} />
                    </button>
                  )}

                   {role === "user" && order.status === "Selesai" && !isOrderRated(order.id) && (
                    <button
                      onClick={() => setShowRatingModalFor(order.id)}
                      className="w-full bg-emerald-500 text-white py-4 rounded-lg text-[10px] font-semibold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Star size={14} className="fill-white" />
                      Rating Kantin
                    </button>
                  )}
                  {role === "user" && isOrderRated(order.id) && (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-3 rounded-lg border border-emerald-100">
                        <Star size={14} className="fill-emerald-600" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Rated {existingRatings.find(r => r.orderId === order.id)?.bintang}/5</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {displayOrders.length === 0 && (
          <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-slate-50 rounded flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100">
               <ClipboardList size={32} />
             </div>
             <h3 className="text-lg font-semibold text-slate-600 uppercase tracking-tighter italic leading-none mb-2">Kosong...</h3>
             <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Belum ada pesanan {activeTab}</p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModalFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRatingModalFor(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl"
             >
                <h3 className="text-2xl font-semibold text-slate-900 tracking-tighter mb-2 uppercase text-center italic">Lezat?</h3>
                <p className="text-[10px] font-semibold text-slate-400 text-center mb-8 uppercase tracking-widest leading-relaxed">Berikan penilaian untuk membantu kantin kami.</p>
                
                <div className="flex justify-center gap-3 mb-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingValue(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        size={40}
                        className={cn(
                          "transition-all duration-300",
                          star <= ratingValue ? "text-emerald-500 fill-emerald-500 scale-110" : "text-slate-200"
                        )}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setShowRatingModalFor(null)} className="flex-1 py-4 text-slate-400 rounded-lg font-semibold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">Batal</button>
                   <button 
                      onClick={() => {
                        const order = orders.find(o => o.id === showRatingModalFor);
                        if (order) submitRating(order);
                      }}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-lg font-semibold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
                    >
                      Kirim
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClipboardList(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      </svg>
    );
}
