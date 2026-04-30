import React from "react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Store, ArrowRight, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { STORAGE_KEYS, CanteenProfile } from "../types";
import { storage } from "../lib/storage";
import CanteenCard from "../components/CanteenCard";

import LandingNavbar from "../components/LandingNavbar";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const canteens = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>KantinKu | Digitalisasi Kantin Kampus Tanpa Antri</title>
        <meta name="description" content="Pesan makanan favoritmu dari mana saja di ekosistem kantin modern kampus." />
      </Helmet>
      
      <LandingNavbar onNavigate={onNavigate} />

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
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter uppercase leading-tight mb-8">
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
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black">{canteens.length}+</div>
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
              <h2 className="text-4xl font-semibold text-slate-900 tracking-tighter uppercase leading-none mb-4">Kantin Pilihan</h2>
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
            {canteens.length > 0 ? canteens.map((kantin: CanteenProfile, idx: number) => (
              <CanteenCard 
                key={kantin.id}
                idx={idx}
                canteen={kantin}
                onClick={() => onNavigate("login")}
              />
            )) : (
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
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-semibold text-xs">
              K
            </div>
            <span className="font-semibold text-lg tracking-tighter uppercase text-slate-900">KantinKu</span>
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
