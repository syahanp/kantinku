import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, LayoutGrid, Package, ShoppingBag, PlusCircle, Image as ImageIcon, Check, X, ToggleLeft, ToggleRight, AlertTriangle, Settings } from "lucide-react";
import { storage } from "../lib/storage";
import { MenuItem, STORAGE_KEYS, Order, CanteenProfile } from "../types";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { cn, formatCurrency, generateId } from "../lib/utils";

interface CanteenDashboardProps {
  onSettings: () => void;
}

export default function CanteenDashboard({ onSettings }: CanteenDashboardProps) {
  const { user } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<CanteenProfile | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  
  // Menu Form
  const [menuForm, setMenuForm] = useState({
    nama: "",
    deskripsi: "",
    harga: 0,
    kategori: "Utama",
    estimasiMenit: 15,
    foto: "https://picsum.photos/seed/food/400/400",
    isAvailable: true,
    isHalal: true,
  });

  const categories = ["Utama", "Minuman", "Snack", "Mie"];

  const refreshData = () => {
    const allMenus = storage.get<MenuItem>(STORAGE_KEYS.MENUS);
    setMenus(allMenus.filter(m => m.kantinId === user?.id));
    
    const allOrders = storage.get<Order>(STORAGE_KEYS.ORDERS);
    setOrders(allOrders.filter(o => o.kantinId === user?.id));

    const profiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);
    setProfile(profiles.find(p => p.kantinId === user?.id) || null);
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar. Maksimal 2MB disarankan untuk performa terbaik.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuForm(prev => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const newMenu: MenuItem = {
      id: editingMenu?.id || generateId(),
      kantinId: user!.id,
      ...menuForm,
    };

    const allMenus = storage.get<MenuItem>(STORAGE_KEYS.MENUS);
    if (editingMenu) {
      const idx = allMenus.findIndex(m => m.id === editingMenu.id);
      allMenus[idx] = newMenu;
    } else {
      allMenus.push(newMenu);
    }
    storage.set(STORAGE_KEYS.MENUS, allMenus);
    
    setIsMenuModalOpen(false);
    setEditingMenu(null);
    setMenuForm({
      nama: "",
      deskripsi: "",
      harga: 0,
      kategori: "Utama",
      estimasiMenit: 15,
      foto: "https://picsum.photos/seed/food/400/400",
      isAvailable: true,
    });
    refreshData();
  };

  const deleteMenu = (id: string) => {
    if (confirm("Hapus menu ini?")) {
      const allMenus = storage.get<MenuItem>(STORAGE_KEYS.MENUS);
      storage.set(STORAGE_KEYS.MENUS, allMenus.filter(m => m.id !== id));
      refreshData();
    }
  };

  const toggleAvailability = (menu: MenuItem) => {
    const allMenus = storage.get<MenuItem>(STORAGE_KEYS.MENUS);
    const idx = allMenus.findIndex(m => m.id === menu.id);
    allMenus[idx].isAvailable = !allMenus[idx].isAvailable;
    storage.set(STORAGE_KEYS.MENUS, allMenus);
    refreshData();
  };

  const activeOrdersCount = orders.filter(o => o.status !== "Selesai").length;
  const totalIncome = orders.filter(o => o.status === "Selesai").reduce((sum, o) => sum + o.totalHarga, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
             <h1 className="text-4xl font-semibold text-slate-900 tracking-tighter uppercase leading-none">
               {profile?.nama || "Manajemen Kantin"}
             </h1>
             <button 
                onClick={onSettings}
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm hover:shadow-lg active:scale-95"
             >
                <Settings size={20} />
             </button>
          </div>
          <p className="text-slate-500 font-medium text-[10px] uppercase tracking-widest">
            {profile?.lokasi || "Kelola menu dan pantau performa kantin Anda secara real-time."}
          </p>
        </div>
        <button
          onClick={() => setIsMenuModalOpen(true)}
          className="bg-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          Tambah Menu Baru
        </button>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Pesanan Aktif", value: activeOrdersCount, icon: ShoppingBag, color: "emerald" },
          { label: "Menu Terdaftar", value: menus.length, icon: Package, color: "slate" },
          { label: "Pendapatan Selesai", value: formatCurrency(totalIncome), icon: LayoutGrid, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-emerald-50/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full group-hover:bg-emerald-50 transition-colors duration-500" />
            <div className="relative">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center text-white mb-6 shadow-lg",
                stat.color === "emerald" ? "bg-emerald-500 shadow-emerald-100" : "bg-slate-800 shadow-slate-100"
              )}>
                <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
              <p className="text-3xl font-semibold text-slate-900 tracking-tighter uppercase">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>


      {/* Menu List Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-slate-900 tracking-widest uppercase">Katalog Menu</h2>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {menus.map((menu) => (
            <motion.div
              layout
              key={menu.id}
              className={cn(
                "group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-500 transition-all shadow-sm hover:shadow-2xl hover:shadow-emerald-50/50",
                !menu.isAvailable && "opacity-75 grayscale-[0.2]"
              )}
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                <img src={menu.foto} alt={menu.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="bg-slate-900 text-white px-3 py-1 rounded text-[8px] font-semibold uppercase tracking-widest">
                      {menu.kategori}
                   </div>
                   {!menu.isAvailable && (
                     <div className="bg-rose-600 text-white px-3 py-1 rounded text-[8px] font-semibold uppercase tracking-widest animate-pulse">
                        Habis
                     </div>
                   )}
                </div>
                <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                   <button 
                      onClick={() => toggleAvailability(menu)}
                      className={cn(
                        "w-10 h-10 rounded-sm flex items-center justify-center transition-all shadow-xl active:scale-95 border",
                        menu.isAvailable ? "bg-white text-slate-900 border-slate-200" : "bg-rose-600 text-white border-rose-500"
                      )}
                    >
                      {menu.isAvailable ? <Check size={18} /> : <X size={18} />}
                   </button>
                </div>
              </div>
              <div className="p-6">
                 <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-tight truncate flex-1">{menu.nama}</h4>
                    <span className="text-sm font-semibold text-emerald-600 ml-4">{formatCurrency(menu.harga)}</span>
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium mb-6 line-clamp-1 tracking-wide">"{menu.deskripsi}"</p>
                 
                 <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingMenu(menu);
                        setMenuForm({
                          nama: menu.nama,
                          deskripsi: menu.deskripsi,
                          harga: menu.harga,
                          kategori: menu.kategori,
                          estimasiMenit: menu.estimasiMenit,
                          foto: menu.foto,
                          isAvailable: menu.isAvailable,
                          isHalal: menu.isHalal
                        });
                        setIsMenuModalOpen(true);
                      }}
                      className="flex-1 py-3 bg-slate-50 text-slate-500 rounded flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all border border-slate-100 hover:border-transparent active:scale-95"
                    >
                      <Edit2 size={12} />
                      Ubah Menu
                    </button>
                    <button
                      onClick={() => deleteMenu(menu.id)}
                      className="w-11 h-11 bg-slate-50 text-slate-300 rounded flex items-center justify-center border border-slate-100 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
          {menus.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100">
                 <Package size={32} />
               </div>
               <h3 className="text-lg font-semibold text-slate-600 uppercase tracking-tighter">Etalase Kosong</h3>
               <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mt-2">Mulai tambahkan menu lezat kamu hari ini.</p>
            </div>
          )}
        </div>
      </section>

      {/* Menu Modal */}
      <AnimatePresence>
        {isMenuModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsMenuModalOpen(false); setEditingMenu(null); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
             >
                <form onSubmit={handleSaveMenu} className="p-7">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tighter uppercase">{editingMenu ? "Update Menu" : "Menu Baru"}</h3>
                    <button type="button" onClick={() => { setIsMenuModalOpen(false); setEditingMenu(null); }} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-4 scrollbar-hide">
                    <div className="space-y-2">
                       <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Judul Menu</label>
                       <input 
                          required
                          value={menuForm.nama}
                          onChange={e => setMenuForm({...menuForm, nama: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold text-slate-800"
                          placeholder="Contoh: Nasi Goreng Gila"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Deskripsi Singkat</label>
                       <textarea 
                          required
                          value={menuForm.deskripsi}
                          onChange={e => setMenuForm({...menuForm, deskripsi: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium text-slate-600 text-sm min-h-[100px]"
                          placeholder="Berikan deskripsi yang menggoda..."
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Harga (Rp)</label>
                          <input 
                             type="number"
                             required
                             value={menuForm.harga}
                             onChange={e => setMenuForm({...menuForm, harga: parseInt(e.target.value) || 0})}
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-emerald-600"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Est. Siap (Menit)</label>
                          <input 
                             type="number"
                             required
                             value={menuForm.estimasiMenit}
                             onChange={e => setMenuForm({...menuForm, estimasiMenit: parseInt(e.target.value) || 0})}
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-700"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Pilih Kategori</label>
                       <div className="flex flex-wrap gap-2">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setMenuForm({...menuForm, kategori: cat})}
                              className={cn(
                                "px-5 py-2.5 rounded text-[10px] font-semibold uppercase tracking-widest border transition-all",
                                menuForm.kategori === cat ? "bg-slate-900 text-white border-transparent shadow-lg" : "bg-white text-slate-400 border-slate-200"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Status Produk</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setMenuForm({...menuForm, isAvailable: !menuForm.isAvailable})}
                            className={cn(
                              "p-4 rounded-lg border transition-all flex items-center justify-between group",
                              menuForm.isAvailable ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-slate-50 border-slate-100 text-slate-300"
                            )}
                          >
                            <span className="text-[9px] font-semibold uppercase tracking-widest">Tersedia</span>
                            {menuForm.isAvailable ? <ToggleRight size={24} className="group-active:scale-90 transition-transform" /> : <ToggleLeft size={24} className="group-active:scale-90 transition-transform" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setMenuForm({...menuForm, isHalal: !menuForm.isHalal})}
                            className={cn(
                              "p-4 rounded-lg border transition-all flex items-center justify-between group",
                              menuForm.isHalal ? "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20" : "bg-slate-50 border-slate-100 text-slate-300"
                            )}
                          >
                            <span className="text-[9px] font-semibold uppercase tracking-widest">Jaminan Halal</span>
                            {menuForm.isHalal ? <ToggleRight size={24} className="group-active:scale-90 transition-transform" /> : <ToggleLeft size={24} className="group-active:scale-90 transition-transform" />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Foto Produk (Upload)</label>
                       <div className="flex gap-4">
                         {menuForm.foto && (
                           <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 group relative">
                             <img src={menuForm.foto} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <p className="text-[8px] text-white font-bold uppercase">Pratinjau</p>
                             </div>
                           </div>
                         )}
                         <div className="flex-1 relative">
                           <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 transition-all group">
                             <div className="flex flex-col items-center justify-center pt-5 pb-6">
                               <ImageIcon className="w-6 h-6 mb-2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Pilih Gambar</p>
                             </div>
                             <input 
                               type="file" 
                               className="hidden" 
                               accept="image/*"
                               onChange={handleFileChange}
                             />
                           </label>
                         </div>
                       </div>
                       <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest px-1 opacity-60">Pilih gambar dari komputer Anda. Ukuran maks 2MB.</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 mt-6">
                    <button type="button" onClick={() => { setIsMenuModalOpen(false); setEditingMenu(null); }} className="py-4 text-slate-400 rounded-lg font-semibold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">Batal</button>
                    <button type="submit" className="py-4 bg-slate-900 text-white rounded-lg font-semibold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]">
                       {editingMenu ? "Simpan Perubahan" : "Tambahkan Menu"}
                    </button>
                  </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
