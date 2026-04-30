import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Star, Clock, ShoppingBag, Plus, Minus, X, Check } from "lucide-react";
import { storage } from "../lib/storage";
import { CanteenProfile, MenuItem, STORAGE_KEYS, Order, OrderItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { cn, formatCurrency, generateId } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

interface CanteenDetailProps {
  id: string;
  onBack: () => void;
  onGoToOrders: () => void;
}

export default function CanteenDetail({ id, onBack, onGoToOrders }: CanteenDetailProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CanteenProfile | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [catatan, setCatatan] = useState("");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [showQRIS, setShowQRIS] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const profiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);
    const foundProfile = profiles.find((p) => p.kantinId === id);
    if (foundProfile) setProfile(foundProfile);

    const allMenus = storage.get<MenuItem>(STORAGE_KEYS.MENUS);
    setMenus(allMenus.filter((m) => m.kantinId === id));

    const savedCart = storage.getObject<any>(STORAGE_KEYS.CART);
    if (savedCart && savedCart.kantinId === id) {
      setCartItems(savedCart.items);
      setCatatan(savedCart.catatan || "");
    }
  }, [id]);

  useEffect(() => {
    storage.setObject(STORAGE_KEYS.CART, { kantinId: id, items: cartItems, catatan });
  }, [cartItems, catatan, id]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menus.map((m) => m.kategori)));
    return ["Utama", ...cats.filter((c) => c !== "Utama")];
  }, [menus]);

  const addToCart = (menu: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuId === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: generateId(), menuId: menu.id, nama: menu.nama, harga: menu.harga, quantity: 1 }];
    });
  };

  const updateQuantity = (menuId: string, delta: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuId === menuId);
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) return prev.filter((item) => item.menuId !== menuId);
      return prev.map((item) =>
        item.menuId === menuId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const totalHarga = cartItems.reduce((sum, item) => sum + item.harga * item.quantity, 0);

  const handleCheckout = () => {
    setShowQRIS(true);
  };

  const confirmPayment = () => {
    if (!profile || !user) return;
    
    setOrderSuccess(true);
    
    const newOrder: Order = {
      id: "ORD-" + generateId().toUpperCase(),
      userId: user.id,
      kantinId: profile.kantinId,
      kantinNama: profile.nama,
      items: cartItems,
      totalHarga: totalHarga,
      catatan: catatan,
      status: "Menunggu Konfirmasi",
      waktuPesan: new Date().toISOString(),
    };

    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS);
    orders.push(newOrder);
    storage.set(STORAGE_KEYS.ORDERS, orders);

    setCartItems([]);
    setCatatan("");
    
    setTimeout(() => {
        setIsCheckoutModalOpen(false);
        setShowQRIS(false);
        setOrderSuccess(false);
        onGoToOrders();
    }, 1500);
  };

  if (!profile) return null;

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-6 group bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-fit text-[10px] font-semibold uppercase tracking-widest"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        <span>KEMBALI KE EKSPLORASI</span>
      </button>

      <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white mb-8 border border-slate-200">
        <div className="h-48 relative bg-slate-300">
          <img
            src={profile.fotoBanner}
            alt={profile.nama}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest">
                  {profile.kategori}
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                  <Star size={10} className="text-emerald-500 fill-emerald-500" />
                  4.8
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-white tracking-tighter uppercase leading-none">{profile.nama}</h1>
              <div className="flex items-center gap-2 text-white/70 mt-2">
                <Clock size={14} />
                <span className="text-[10px] font-semibold uppercase tracking-widest">{profile.jamBuka} - {profile.jamTutup}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white">
          <p className="text-slate-500 text-xs font-medium max-w-2xl leading-relaxed">{profile.deskripsi}</p>
        </div>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <section key={cat} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-slate-800 tracking-widest uppercase">{cat}</h2>
              <div className="flex-1 h-[1px] bg-slate-200 mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menus
                .filter((m) => m.kategori === cat)
                .map((menu) => (
                  <div
                    key={menu.id}
                    className={cn(
                      "group bg-white rounded-xl p-3 border border-slate-200 flex gap-4 transition-all duration-300",
                      menu.isAvailable ? "hover:border-emerald-300 hover:shadow-md" : "opacity-60"
                    )}
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
                       <img src={menu.foto} alt={menu.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                       {!menu.isAvailable && (
                         <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                            <span className="text-white text-[9px] font-semibold uppercase tracking-tighter">Habis</span>
                         </div>
                       )}
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
                      <div>
                        <h4 className="font-semibold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors uppercase text-[11px] tracking-widest flex items-center gap-2 truncate">
                          {menu.nama}
                          {menu.isHalal && (
                            <span className="bg-emerald-50 text-emerald-700 text-[8px] px-1.5 py-0.5 rounded font-semibold border border-emerald-100 uppercase tracking-tighter">Halal</span>
                          )}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{menu.deskripsi}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-semibold text-slate-900">{formatCurrency(menu.harga)}</span>
                        {menu.isAvailable ? (
                          cartItems.find(i => i.menuId === menu.id) ? (
                            <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-0.5">
                              <button onClick={() => updateQuantity(menu.id, -1)} className="p-1 hover:bg-white rounded transition-colors text-slate-400 hover:text-emerald-600"><Minus size={12} /></button>
                              <span className="w-6 text-center text-[10px] font-semibold">{cartItems.find(i => i.menuId === menu.id)?.quantity}</span>
                              <button onClick={() => updateQuantity(menu.id, 1)} className="p-1 hover:bg-white rounded transition-colors text-slate-400 hover:text-emerald-600"><Plus size={12} /></button>
                            </div>
                          ) : (
                            <button
                                onClick={() => addToCart(menu)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-[10px] font-semibold uppercase tracking-widest transition-all active:scale-95"
                            >
                                Tambah
                            </button>
                          )
                        ) : (
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded border border-slate-100">Habis</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>

      {/* Floating Bar for Cart */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-20 lg:bottom-10 left-4 right-4 lg:left-auto lg:right-10 lg:w-96 z-40"
          >
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded flex items-center justify-center relative shadow-lg shadow-emerald-500/20">
                  <ShoppingBag size={20} />
                  <div className="absolute -top-1.5 -right-1.5 bg-white text-slate-900 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold border-2 border-slate-900">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Total Pesanan</p>
                  <p className="text-lg font-semibold tracking-tighter">{formatCurrency(totalHarga)}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !orderSuccess && setIsCheckoutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                {!showQRIS ? (
                  <>
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                      <h3 className="text-2xl font-semibold text-slate-900 tracking-tighter uppercase">Konfirmasi</h3>
                      {!orderSuccess && (
                        <button onClick={() => setIsCheckoutModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                          <X size={20} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-4">
                               <span className="font-semibold text-slate-400 text-[10px] uppercase">x{item.quantity}</span>
                               <span className="font-semibold text-slate-800 uppercase tracking-widest text-[11px]">{item.nama}</span>
                            </div>
                            <span className="font-semibold text-slate-900 text-xs">{formatCurrency(item.harga * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1">Instruksi Khusus</label>
                        <textarea
                          placeholder="Misal: Kurangi pedas, tambahkan sedotan..."
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium min-h-[80px] text-xs"
                        />
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                         <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total Tagihan</span>
                            <span className="text-3xl font-semibold text-emerald-600 tracking-tighter uppercase">{formatCurrency(totalHarga)}</span>
                         </div>
                         <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 mb-6 flex gap-3 text-emerald-700">
                            <ShoppingBag size={16} />
                            <p className="text-[9px] font-semibold uppercase tracking-widest leading-relaxed">
                              Pilih metode pembayaran QRIS untuk proses instan.
                            </p>
                         </div>
                         
                         <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-emerald-500 text-white rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                         >
                            Lanjut ke Pembayaran QRIS
                         </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                      <h3 className="text-2xl font-semibold text-slate-900 tracking-tighter uppercase">Pembayaran QRIS</h3>
                      {!orderSuccess && (
                        <button onClick={() => setShowQRIS(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    
                    <div className="bg-white p-6 border-2 border-slate-100 rounded-2xl inline-block mb-6 shadow-sm">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=KantinKu-Payment-${totalHarga}`} 
                        alt="QRIS QR Code" 
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                    
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center justify-center gap-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-6" />
                        <div className="w-[1px] h-4 bg-slate-300" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Indonesian QR Standard</span>
                      </div>
                      <p className="text-2xl font-semibold text-slate-800 tracking-tight">{formatCurrency(totalHarga)}</p>
                    </div>

                    <button
                      onClick={confirmPayment}
                      disabled={orderSuccess}
                      className={cn(
                        "w-full py-4 rounded-xl font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                        orderSuccess ? "bg-green-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl"
                      )}
                    >
                      {orderSuccess ? (
                        <>
                          <Check size={18} />
                          Pembayaran Berhasil!
                        </>
                      ) : (
                        "Saya Sudah Bayar"
                      )}
                    </button>
                    
                    <p className="mt-6 text-[9px] text-slate-400 font-semibold uppercase tracking-widest italic">
                      Silahkan scan kode QR di atas menggunakan aplikasi bank atau e-wallet pilihan Anda.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
