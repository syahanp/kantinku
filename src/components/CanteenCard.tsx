import React from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { CanteenProfile, STORAGE_KEYS } from "../types";
import { storage } from "../lib/storage";
import { cn } from "../lib/utils";

interface CanteenCardProps {
  canteen: CanteenProfile;
  onClick: () => void;
  idx?: number;
}

export default function CanteenCard({ canteen, onClick, idx = 0 }: CanteenCardProps) {
  const menuCount = storage.get<any>(STORAGE_KEYS.MENUS).filter((m: any) => m.kantinId === canteen.kantinId).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 w-full relative overflow-hidden bg-slate-200">
        <img
          src={canteen.fotoBanner || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60"}
          alt={canteen.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-md bg-emerald-500/90 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Buka Sekarang
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
            <p className="text-[9px] text-white uppercase font-black tracking-[0.2em]">{canteen.kategori}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors uppercase leading-none">{canteen.nama}</h3>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <MapPin size={10} className="text-emerald-500" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{canteen.lokasi || "Lokasi tidak tersedia"}</span>
        </div>
        
        <div className="mt-4 pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-medium uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm shadow-emerald-500/5">
              {menuCount} Menu
            </span>
          </div>
          <div className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            Pesan Sekarang →
          </div>
        </div>
      </div>
    </motion.div>
  );
}
