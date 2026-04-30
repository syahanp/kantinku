import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Camera, Clock, Save, Ban, CheckCircle, Store, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { storage } from "../lib/storage";
import { CanteenProfile, STORAGE_KEYS, User as UserType } from "../types";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export default function ProfilePage() {
  const { user, session, refreshUser } = useAuth();
  const [profile, setProfile] = useState<CanteenProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Profile Form state
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    kategori: "",
    fotoBanner: "",
    jamBuka: "08:00",
    jamTutup: "17:00",
    isTutupManual: false,
  });

  useEffect(() => {
    if (session?.role === "kantin") {
      const allProfiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);
      const found = allProfiles.find(p => p.kantinId === user?.id);
      if (found) {
        setProfile(found);
        setFormData({
          nama: found.nama,
          deskripsi: found.deskripsi,
          kategori: found.kategori,
          fotoBanner: found.fotoBanner,
          jamBuka: found.jamBuka,
          jamTutup: found.jamTutup,
          isTutupManual: found.isTutupManual,
        });
      }
    }
  }, [user, session]);

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Update User Name
    const allUsers = storage.get<UserType>(STORAGE_KEYS.USERS);
    const userIdx = allUsers.findIndex(u => u.id === user?.id);
    if (userIdx !== -1) {
      allUsers[userIdx].name = formData.nama;
      storage.set(STORAGE_KEYS.USERS, allUsers);
    }

    // Update Canteen Profile if applicable
    if (session?.role === "kantin") {
      const allProfiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);
      const profileIdx = allProfiles.findIndex(p => p.kantinId === user?.id);
      if (profileIdx !== -1) {
        allProfiles[profileIdx] = {
          ...allProfiles[profileIdx],
          ...formData,
        };
        storage.set(STORAGE_KEYS.CANTIN_PROFILES, allProfiles);
      }
    }

    setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        refreshUser();
        setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <header className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-semibold text-slate-900 tracking-tighter uppercase italic leading-none">Pengaturan Profil</h1>
        <p className="text-slate-500 mt-3 font-medium text-[10px] uppercase tracking-widest">Kelola identitas dan preferensi operasional akun Anda.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card Summary */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-12 -mt-12 rounded-full transition-transform group-hover:scale-150 duration-700" />
               <div className="w-24 h-24 bg-slate-900 rounded-sm flex items-center justify-center text-emerald-500 mx-auto mb-8 border-4 border-white shadow-2xl uppercase font-semibold text-3xl italic">
                 {user?.name.substring(0, 2)}
               </div>
               <h3 className="text-2xl font-semibold text-slate-900 uppercase tracking-tighter italic">{user?.name}</h3>
               <p className="text-[10px] font-semibold text-slate-400 mt-2 uppercase tracking-widest">{user?.email}</p>
               <div className="mt-8 pt-8 border-t border-slate-50">
                  <span className="bg-emerald-50 px-4 py-2 rounded text-[9px] font-semibold uppercase tracking-[0.3em] text-emerald-600 border border-emerald-100 italic">
                     {session?.role === "user" ? "Mahasiswa" : "Kantin Owner"}
                  </span>
               </div>
           </div>

           {session?.role === "kantin" && (
             <div className="bg-slate-900 text-white rounded-2xl p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-4 mb-8">
                   <div className="bg-white/10 p-3 rounded"><Clock size={20} className="text-emerald-500" /></div>
                   <h4 className="font-semibold text-[10px] uppercase tracking-[0.3em]">Operasional Live</h4>
                </div>
                <div className="space-y-6">
                   <div className="p-5 bg-white/5 rounded border border-white/5 flex flex-col gap-1">
                      <span className="text-[9px] font-semibold uppercase tracking-widest opacity-40">Status Sekarang</span>
                      <div className="flex items-center gap-3 mt-1">
                         <div className={cn("w-2 h-2 rounded-full", formData.isTutupManual ? "bg-rose-500" : "bg-emerald-500 animate-pulse")} />
                         <span className="text-xs font-semibold uppercase tracking-tighter italic">{formData.isTutupManual ? "TUTUP PAKSA" : "DIBUKA UNTUK UMUM"}</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => setFormData({...formData, isTutupManual: !formData.isTutupManual})}
                  className={cn(
                    "w-full mt-8 py-5 rounded font-semibold text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 border shadow-xl shadow-black/20",
                    formData.isTutupManual ? "bg-emerald-500 text-white border-emerald-400" : "bg-white/5 text-rose-500 border-rose-500/30 hover:bg-rose-500 hover:text-white"
                  )}
                >
                  {formData.isTutupManual ? <CheckCircle size={16} /> : <Ban size={16} />}
                  {formData.isTutupManual ? "AKTIFKAN KANTIN" : "TUTUP SEMENTARA"}
                </button>
             </div>
           )}
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-2xl p-10 lg:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-1 h-32 bg-orange-500" />
             <form onSubmit={handleUpdateUser} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Nama Tampilan</label>
                      <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                         <input 
                            required
                            value={formData.nama}
                            onChange={e => setFormData({...formData, nama: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-sm text-slate-800"
                         />
                      </div>
                   </div>
                   <div className="space-y-2 opacity-50">
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Email Sistem</label>
                      <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                         <input 
                            readOnly
                            value={user?.email}
                            className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed font-medium text-sm text-slate-400"
                         />
                      </div>
                   </div>
                </div>

                {session?.role === "kantin" && (
                  <div className="space-y-10 animate-in slide-in-from-top-4 duration-500">
                    <div className="space-y-2">
                       <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Narasi Kantin</label>
                       <textarea 
                          required
                          rows={3}
                          value={formData.deskripsi}
                          onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                          className="w-full p-5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium text-sm text-slate-600"
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Kategori Utama</label>
                          <select 
                             value={formData.kategori}
                             onChange={e => setFormData({...formData, kategori: e.target.value})}
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-[10px] uppercase tracking-widest text-slate-700"
                          >
                             <option value="Semua">Semua</option>
                             <option value="Nasi">Nasi</option>
                             <option value="Mie">Mie</option>
                             <option value="Minuman">Minuman</option>
                             <option value="Snack">Snack</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Pukul Buka</label>
                          <input 
                             type="time"
                             required
                             value={formData.jamBuka}
                             onChange={e => setFormData({...formData, jamBuka: e.target.value})}
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-sm text-slate-800"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Pukul Tutup</label>
                          <input 
                             type="time"
                             required
                             value={formData.jamTutup}
                             onChange={e => setFormData({...formData, jamTutup: e.target.value})}
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-sm text-slate-800"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Estetika Banner (URL Foto)</label>
                       <div className="relative">
                          <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                             value={formData.fotoBanner}
                             onChange={e => setFormData({...formData, fotoBanner: e.target.value})}
                             className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono text-[10px] text-slate-400"
                          />
                       </div>
                    </div>
                  </div>
                )}

                <div className="pt-10 border-t border-slate-50">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full py-5 rounded-lg font-semibold text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] disabled:opacity-70",
                        success ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                      )}
                    >
                      {isLoading ? (
                        <RefreshCw className="animate-spin text-emerald-400" size={20} />
                      ) : success ? (
                        <>
                           <CheckCircle size={20} className="italic" />
                           Berhasil Disimpan
                        </>
                      ) : (
                        <>
                           <Save size={18} />
                           Konfirmasi Pembaruan
                        </>
                      )}
                    </button>
                    {success && (
                      <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded flex items-center gap-4 text-emerald-700">
                        <AlertCircle size={18} />
                        <span className="text-[9px] font-semibold uppercase tracking-widest">Informasi Anda telah diperbarui dalam sesi ini.</span>
                      </motion.div>
                    )}
                </div>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
}

function RefreshCw(props: any) {
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
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </svg>
    );
}
