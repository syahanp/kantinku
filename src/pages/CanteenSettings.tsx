import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Camera, MapPin, Tag, Type, AlignLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { storage } from "../lib/storage";
import { CanteenProfile, STORAGE_KEYS } from "../types";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface CanteenSettingsProps {
  onBack: () => void;
}

export default function CanteenSettings({ onBack }: CanteenSettingsProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CanteenProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    lokasi: "",
    kategori: "",
    fotoBanner: "",
  });

  useEffect(() => {
    if (user) {
      const profiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);
      const myProfile = profiles.find(p => p.kantinId === user.id);
      if (myProfile) {
        setProfile(myProfile);
        setForm({
          nama: myProfile.nama,
          deskripsi: myProfile.deskripsi,
          lokasi: myProfile.lokasi || "",
          kategori: myProfile.kategori,
          fotoBanner: myProfile.fotoBanner,
        });
      }
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, fotoBanner: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const profiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);
    const updatedProfiles = profiles.map(p => {
      if (p.kantinId === user?.id) {
        return {
          ...p,
          ...form
        };
      }
      return p;
    });

    storage.set(STORAGE_KEYS.CANTIN_PROFILES, updatedProfiles);
    
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Helmet>
        <title>Pengaturan Kantin | KantinKu</title>
        <meta name="description" content="Perbarui profil dan identitas kantin Anda." />
      </Helmet>
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition-all hover:shadow-lg active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-900 tracking-tighter uppercase">Pengaturan Kantin</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Banner Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Banner Kantin</label>
          <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
            {form.fotoBanner ? (
              <img src={form.fotoBanner} alt="Banner" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                <Camera size={48} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
              </div>
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white flex items-center gap-2">
                <Camera size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Ganti Banner</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nama Kantin</label>
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                value={form.nama}
                onChange={e => setForm({...form, nama: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-900"
                placeholder="Nama kantin Anda"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Kategori</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                value={form.kategori}
                onChange={e => setForm({...form, kategori: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-900"
                placeholder="Contoh: Nasi, Bakso, Minuman"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Lokasi Detail</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              required
              value={form.lokasi}
              onChange={e => setForm({...form, lokasi: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-900"
              placeholder="Contoh: Gedung C, Lantai 1, Belakang Perpustakaan"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Deskripsi Kantin</label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 text-slate-300" size={18} />
            <textarea 
              required
              value={form.deskripsi}
              onChange={e => setForm({...form, deskripsi: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-600 min-h-[120px]"
              placeholder="Ceritakan tentang masakan khas kantin Anda..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]",
            savedSuccess 
              ? "bg-emerald-500 text-white shadow-emerald-500/20" 
              : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800"
          )}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : savedSuccess ? (
            <>Tersimpan!</>
          ) : (
            <>
              <Save size={18} />
              Simpan Perubahan
            </>
          )}
        </button>
      </form>
    </div>
  );
}
