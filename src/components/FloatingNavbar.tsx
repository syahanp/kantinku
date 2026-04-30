import React, { useState } from "react";
import { Home, ClipboardList, User, LogOut, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface FloatingNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function FloatingNavbar({ activeTab, onTabChange }: FloatingNavbarProps) {
  const { session, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { id: "home", label: session?.role === "user" ? "Utama" : "Dashboard", icon: Home },
    { id: "orders", label: "Pesanan", icon: ClipboardList },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl shadow-slate-900/40">
      <div className="flex items-center gap-1 sm:gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 relative group",
              activeTab === item.id 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <item.icon size={18} className={cn("transition-transform", activeTab === item.id ? "scale-110" : "group-hover:scale-110")} />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="nav-active" 
                className="absolute inset-0 bg-emerald-500 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="w-[1px] h-6 bg-white/10 mx-2" />

      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
            showUserMenu ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <User size={16} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Profil</span>
        </button>

        <AnimatePresence>
          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setShowUserMenu(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute bottom-full right-0 mb-4 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Masuk Sebagai</p>
                  <p className="text-xs font-semibold text-white truncate">{session?.name}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Keluar Sesi</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
