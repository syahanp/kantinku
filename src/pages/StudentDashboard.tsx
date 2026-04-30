import { useState, useEffect, useMemo } from "react";
import { Star, Search, Filter, Clock, ChevronRight } from "lucide-react";
import { storage } from "../lib/storage";
import { CanteenProfile, STORAGE_KEYS, Rating } from "../types";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

interface StudentDashboardProps {
  onSelectCanteen: (id: string) => void;
}

export default function StudentDashboard({ onSelectCanteen }: StudentDashboardProps) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<CanteenProfile[]>([]);
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    setProfiles(storage.get(STORAGE_KEYS.CANTIN_PROFILES));
    setRatings(storage.get(STORAGE_KEYS.RATINGS));
  }, []);

  const isOpen = (profile: CanteenProfile) => {
    if (profile.isTutupManual) return false;
    
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return currentTime >= profile.jamBuka && currentTime <= profile.jamTutup;
  };

  const getAverageRating = (kantinId: string) => {
    const kantinRatings = ratings.filter(r => r.kantinId === kantinId);
    if (kantinRatings.length === 0) return 0;
    const sum = kantinRatings.reduce((acc, r) => acc + r.bintang, 0);
    return (sum / kantinRatings.length).toFixed(1);
  };

  const filteredCanteens = useMemo(() => {
    return profiles.filter(p => {
      return p.nama.toLowerCase().includes(search.toLowerCase());
    });
  }, [profiles, search]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-semibold text-slate-900 leading-none tracking-tighter uppercase">Halo, {user?.name.split(" ")[0]}!</h1>
          <p className="text-slate-500 mt-3 font-medium">Pilih kantin favoritmu untuk mulai memesan hari ini.</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari kantin idaman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-sm"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCanteens.map((c) => {
          const openStatus = isOpen(c);
          return (
            <motion.div
              key={c.kantinId}
              whileHover={{ y: -4 }}
              onClick={() => openStatus && onSelectCanteen(c.kantinId)}
              className={cn(
                "group relative bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300",
                openStatus ? "cursor-pointer hover:shadow-2xl hover:shadow-emerald-50 hover:border-emerald-300" : "opacity-75 grayscale"
              )}
            >
              <div className="h-48 w-full relative overflow-hidden bg-slate-200">
                <img
                  src={c.fotoBanner}
                  alt={c.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className={cn(
                    "px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5 shadow-lg",
                    openStatus ? "bg-green-500 text-white" : "bg-slate-500 text-white"
                  )}>
                    {openStatus ? "Buka" : "Tutup"}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-[10px] text-white/80 uppercase font-semibold tracking-widest">{c.kategori}</p>
                </div>
                {!openStatus && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white font-semibold text-2xl uppercase tracking-tighter italic border-2 border-white px-4 py-2">CLOSED</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-slate-800 tracking-tighter group-hover:text-emerald-600 transition-colors uppercase leading-none">{c.nama}</h3>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-emerald-500">
                      <span className="text-sm font-semibold">{getAverageRating(c.kantinId)}</span>
                      <Star className="fill-emerald-500" size={14} />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                      {storage.get<any>(STORAGE_KEYS.MENUS).filter((m: any) => m.kantinId === c.kantinId).length} Menu
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 line-clamp-1 mt-2">{c.deskripsi}</p>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">{c.jamBuka} - {c.jamTutup}</span>
                  </div>
                  {openStatus && (
                    <div className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded">
                      Pesan Sekarang →
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {filteredCanteens.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Search size={40} />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 uppercase tracking-tighter">Tidak ada kantin</h3>
            <p className="text-slate-400 mt-1 font-medium">Coba gunakan kata kunci pencarian lain.</p>
          </div>
        )}
      </div>
    </div>
  );
}
