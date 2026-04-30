import { Home, ClipboardList, User, LogOut, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const { logout, session, user } = useAuth();

  const menuItems = [
    { id: "home", label: session?.role === "user" ? "Eksplorasi" : "Dashboard", icon: Home },
    { id: "orders", label: "Pesanan Saya", icon: ClipboardList },
    { id: "profile", label: "Akun Profil", icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 p-6 z-40">
        <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer" onClick={() => onNavigate("home")}>
          <div className="w-10 h-10 bg-emerald-500 rounded-sm flex items-center justify-center text-white font-semibold text-2xl shadow-sm transition-transform group-hover:scale-105">
            K
          </div>
          <span className="text-2xl font-semibold text-slate-800 tracking-tighter">KantinKu</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold uppercase tracking-wider",
                currentPath === item.id || (item.id === "home" && currentPath === "canteen")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-emerald-500"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 mt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-emerald-500 overflow-hidden shrink-0">
               <div className="w-full h-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-white">USER</div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-800 truncate leading-none mb-1">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">{session?.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-xs font-semibold uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-3 z-50">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              currentPath === item.id || (item.id === "home" && currentPath === "canteen")
                ? "text-emerald-600"
                : "text-slate-400 shadow-emerald-100"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-semibold uppercase tracking-tighter">{item.label.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
