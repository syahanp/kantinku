import React from "react";
import { motion } from "motion/react";
import { Store, ArrowRight, Star, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { STORAGE_KEYS, CanteenProfile } from "../types";
import { storage } from "../lib/storage";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const canteens = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("landing")}>
            <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 italic font-semibold">
              K
            </div>
            <span className="font-semibold text-xl tracking-tighter uppercase italic text-slate-900">KantinKu</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#featured" className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Kantin Pilihan</a>
            <button 
              onClick={() => onNavigate("login")}
              className="bg-emerald-500 text-white px-8 py-3 rounded-lg text-[10px] font-semibold uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600 mb-8">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Digitalisasi Kantin Kampus</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-semibold text-slate-900 tracking-tighter uppercase italic leading-[0.9] mb-8">
              Jajan di Kampus <br />
              <span className="text-emerald-500">Tanpa Antri.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-10 max-w-lg">
              Pesan makanan favoritmu dari mana saja, ambil saat sudah siap. Nikmati kemudahan bertransaksi di ekosistem kantin modern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate("login")}
                className="bg-emerald-500 text-white px-10 py-5 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 group"
              >
                Mulai Sekarang
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate("login")}
                className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
              >
                Cek Menu
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-100 border-8 border-white relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover" 
                alt="Food" 
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white italic font-black">{canteens.length}+</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kantin Aktif</p>
                  <p className="text-sm font-black text-slate-900">Di Kampus Anda</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* List Kantin Pilihan */}
      <section id="featured" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl font-semibold text-slate-900 tracking-tighter uppercase italic leading-none mb-4">Kantin Pilihan</h2>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Kantin terpopuler dengan rating terbaik minggu ini.</p>
            </div>
            <button 
              onClick={() => onNavigate("login")}
              className="text-emerald-600 text-[10px] font-semibold uppercase tracking-[0.3em] hover:text-emerald-700 transition-colors flex items-center gap-2 group"
            >
              Lihat Semua
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {canteens.length > 0 ? canteens.map((kantin: CanteenProfile, idx: number) => {
              const menuCount = storage.get<any>(STORAGE_KEYS.MENUS).filter((m: any) => m.kantinId === kantin.kantinId).length;
              return (
                <motion.div
                  key={kantin.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 group cursor-pointer"
                  onClick={() => onNavigate("login")}
                >
                  <div className="aspect-[16/9] overflow-hidden grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700">
                    <img src={kantin.fotoBanner || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60"} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={kantin.nama} />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2 text-amber-500">
                        <Star size={14} className="fill-amber-500" />
                        <span className="text-[10px] font-semibold uppercase">{(4.5 + idx * 0.1).toFixed(1)}</span>
                      </div>
                      <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-widest">
                        {menuCount} Menu
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 uppercase tracking-tighter italic mb-2">{kantin.nama}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest line-clamp-1 mb-6">"{kantin.deskripsi || "Kantin kampus favorit mahasiswa."}"</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[10px] font-semibold uppercase tracking-widest">{kantin.jamBuka} - {kantin.jamTutup}</span>
                      </div>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded text-[8px] font-semibold uppercase tracking-widest">Open Now</div>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-100 aspect-[16/9] rounded-2xl animate-pulse" />
                ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white italic font-semibold text-xs">
              K
            </div>
            <span className="font-semibold text-lg tracking-tighter uppercase italic text-slate-900">KantinKu</span>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">© 2024 Digital Campus Ecosystem</p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
