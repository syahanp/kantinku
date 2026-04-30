import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { storage } from "../lib/storage";
import { CanteenProfile, STORAGE_KEYS, Rating } from "../types";
import { useAuth } from "../context/AuthContext";
import CanteenCard from "../components/CanteenCard";

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
        {filteredCanteens.map((c, idx) => (
          <CanteenCard 
            key={c.kantinId} 
            idx={idx}
            canteen={c} 
            onClick={() => onSelectCanteen(c.kantinId)} 
          />
        ))}
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
