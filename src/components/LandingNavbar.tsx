import React from "react";

import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

export default function LandingNavbar() {
  const navigate = useNavigate();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 flex items-center justify-between">
        <Logo 
          onClick={() => navigate("/")} 
          iconSize={18} 
          textSize="text-lg" 
          className="px-4 py-2" 
        />
        
        <div className="flex items-center gap-8">
          <a href="#featured" className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-500 transition-colors">Eksplorasi</a>
          <button 
            onClick={() => navigate("/login")}
            className="px-8 py-3.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Masuk
          </button>
        </div>
      </div>
    </nav>
  );
}
