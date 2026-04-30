import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { Mail, Lock, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";

interface LoginProps {
  onNavigate: (path: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password11");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      setError("");
    } else {
      setError("Email atau kata sandi salah. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <Helmet>
        <title>Masuk | KantinKu</title>
        <meta name="description" content="Masuk ke akun KantinKu Anda." />
      </Helmet>
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[100px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-500 rounded-full blur-[100px] -ml-64 -mb-64" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <Logo iconSize={28} textSize="text-3xl" className="px-8 py-4 mb-6" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Sistem Pemesanan Cerdas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-5">
            <div className="space-y-1">
               <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Alamat Email</label>
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input
                   type="email"
                   placeholder="mahasiswa@gmail.com"
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
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm"
                 />
               </div>
            </div>
          </div>

          {error && <p className="text-[10px] uppercase font-semibold tracking-widest text-rose-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-5 bg-emerald-500 text-white rounded-lg font-semibold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <LogIn size={18} />
            Masuk Sekarang
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Kembali ke Beranda?{" "}
            <button
              onClick={() => onNavigate("landing")}
              className="text-emerald-500 hover:text-emerald-600 transition-colors ml-1"
            >
              Beranda
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
