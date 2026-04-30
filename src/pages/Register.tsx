import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Store, Mail, Lock, User, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { generateId } from "../lib/utils";

interface RegisterProps {
  onNavigate: (path: string) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"user" | "kantin">("user");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = register({
      id: generateId(),
      name,
      email,
      role,
    });

    if (success) {
      setError("");
    } else {
      setError("Email sudah digunakan.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <Helmet>
        <title>Daftar | KantinKu</title>
        <meta name="description" content="Buat akun KantinKu baru." />
      </Helmet>
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[120px] -ml-64 -mt-64" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-slate-500 rounded-full blur-[120px] -mr-64 -mb-64" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-14 h-14 bg-emerald-500 rounded flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-6 transition-transform hover:-rotate-6">
            <UserPlus size={28} />
          </div>
          <h1 className="text-4xl font-semibold text-slate-900 tracking-tighter uppercase leading-none">Buat Akun</h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mt-3">Bergabung ke Ekosistem Kami</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-3 px-4 rounded text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                role === "user" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-emerald-500"
              }`}
            >
              Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => setRole("kantin")}
              className={`flex-1 py-3 px-4 rounded text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                role === "kantin" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-emerald-500"
              }`}
            >
              Kantin
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-1">
               <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Identitas Anda</label>
               <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input
                   type="text"
                   placeholder={role === "user" ? "Nama Lengkap" : "Nama Kantin"}
                   required
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm"
                 />
               </div>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Alamat Email</label>
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input
                   type="email"
                   placeholder="nama@kampus.ac.id"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm"
                 />
               </div>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Kata Sandi</label>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input
                   type="password"
                   placeholder="••••••••"
                   required
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                 />
               </div>
            </div>
          </div>

          {error && <p className="text-[10px] uppercase font-semibold tracking-widest text-rose-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-5 bg-emerald-500 text-white rounded-lg font-semibold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <UserPlus size={18} />
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Sudah Memiliki Akses?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="text-emerald-500 font-semibold hover:text-emerald-600 transition-colors ml-1"
            >
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
