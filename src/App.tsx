/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/StudentDashboard";
import CanteenDashboard from "./pages/CanteenDashboard";
import OrdersPage from "./pages/OrdersPage";
import CanteenDetail from "./pages/CanteenDetail";
import { UserRole, STORAGE_KEYS, User, CanteenProfile } from "./types";
import FloatingNavbar from "./components/FloatingNavbar";
import { Store } from "lucide-react";
import { storage } from "./lib/storage";

function AppContent() {
  const { session, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [selectedCanteenId, setSelectedCanteenId] = useState<string | null>(null);

  // Reset page to home when logging in
  useEffect(() => {
    if (session && (currentPage === "landing" || currentPage === "login")) {
      setCurrentPage("home");
    }
  }, [session, currentPage]);

  // Initialize mock data
  useEffect(() => {
    const users = storage.get<User>(STORAGE_KEYS.USERS);
    
    // Check if mock users already exist
    const mockStudentEmail = "mahasiswa@gmail.com";
    const mockCanteenEmail = "kantin-makmur@gmail.com";
    
    const hasStudent = users.some(u => u.email === mockStudentEmail);
    const hasCanteen = users.some(u => u.email === mockCanteenEmail);
    
    // Check for duplicates in current storage
    const currentProfiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);
    const hasDuplicates = new Set(currentProfiles.map(p => p.nama)).size !== currentProfiles.length;

    // Force refresh menus if request specifically for the new list
    const currentMenus = storage.get<any>(STORAGE_KEYS.MENUS);
    const menusNeedUpdate = currentMenus.length < 10 || !currentMenus.some((m: any) => m.foto === "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400");

    if (!hasStudent) {
      const studentId = "student_mock_1";
      storage.save<User>(STORAGE_KEYS.USERS, {
        id: studentId,
        name: "Budi Mahasiswa",
        email: mockStudentEmail,
        password: "password11",
        role: "user"
      });
    }

    if (!hasCanteen || menusNeedUpdate || hasDuplicates) {
      const mockCanteens = [
        { id: "kantin_mock_1", name: "Kantin Makmur", email: "kantin-makmur@gmail.com", desc: "Sedia berbagai macam nasi rames dan penyetan lezat.", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000", cat: "Nasi" },
        { id: "kantin_mock_2", name: "Kantin Ojak", email: "kantin-ojak@gmail.com", desc: "Mie ayam dan bakso urat legendaris kampus.", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1000", cat: "Bakso" },
        { id: "kantin_mock_3", name: "Kantin Berkah", email: "kantin-berkah@gmail.com", desc: "Spesialis nasi goreng dan olahan ayam.", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000", cat: "Nasi" },
        { id: "kantin_mock_4", name: "Kantin Sehat", email: "kantin-sehat@gmail.com", desc: "Aneka salad, jus buah segar, dan makanan sehat.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000", cat: "Sehat" },
        { id: "kantin_mock_5", name: "Kantin Pojok", email: "kantin-pojok@gmail.com", desc: "Cemilan hits, kopi, dan tempat nongkrong asik.", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000", cat: "Minuman" },
      ];

      if (!hasCanteen || hasDuplicates) {
        // Remove ANY existing mock canteen users and profiles first to ensure absolute cleanliness
        const cleanedUsers = storage.get<User>(STORAGE_KEYS.USERS).filter(u => {
          const isMockCanteen = mockCanteens.some(mc => mc.email === u.email);
          return !isMockCanteen;
        });
        storage.set(STORAGE_KEYS.USERS, cleanedUsers);
        
        // Profiles already filtered by name is safer
        const cleanedProfiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES).filter(p => {
          return !mockCanteens.some(mc => mc.name === p.nama);
        });
        storage.set(STORAGE_KEYS.CANTIN_PROFILES, cleanedProfiles);

        mockCanteens.forEach(c => {
          storage.save<User>(STORAGE_KEYS.USERS, {
            id: c.id,
            name: c.name,
            email: c.email,
            password: "password11",
            role: "kantin"
          });

          storage.saveById<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES, {
            id: c.id,
            kantinId: c.id,
            nama: c.name,
            deskripsi: c.desc,
            kategori: c.cat,
            fotoBanner: c.img,
            jamBuka: "08:00",
            jamTutup: "17:00",
            isTutupManual: false
          });
        });
      }

      // Re-seed menus if they were missing or outdated
      if (menusNeedUpdate) {
        // Clear all menus first to avoid duplicates or old data
        localStorage.removeItem(STORAGE_KEYS.MENUS);
        
        const canteenProfiles = storage.get<CanteenProfile>(STORAGE_KEYS.CANTIN_PROFILES);
        canteenProfiles.forEach(c => {
          const menuTemplates = [
            { name: "Ayam Goreng", desc: "Ayam goreng bumbu kuning yang gurih dan renyah.", price: 15000, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400" },
            { name: "Nasi Goreng", desc: "Nasi goreng spesial dengan telur mata sapi dan kerupuk.", price: 13000, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400" },
            { name: "Mie Goreng", desc: "Mie goreng lezat dengan campuran sayur dan telur orak-arik.", price: 12000, img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400" },
            { name: "Gado-Gado", desc: "Sayuran segar dengan saus kacang kental yang otentik.", price: 11000, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" },
            { name: "Nasi Uduk", desc: "Nasi gurih dengan pendamping ayam suwir, telur, dan sambal.", price: 14000, img: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400" },
            { name: "Tempe Orek", desc: "Tumis tempe manis pedas dengan bumbu kecap meresap.", price: 8000, img: "https://images.unsplash.com/photo-1543332164-6e82f3555182?w=400" },
          ];

          menuTemplates.forEach((t, i) => {
            storage.save<any>(STORAGE_KEYS.MENUS, {
              id: `menu_${c.kantinId}_${i + 1}`,
              kantinId: c.kantinId,
              nama: t.name,
              deskripsi: t.desc,
              harga: t.price,
              isAvailable: true,
              isHalal: true,
              estimasiMenit: 15,
              foto: t.img,
              kategori: i < 3 ? "Makanan Utama" : i < 5 ? "Sup & Sayur" : "Lauk Pauk"
            });
          });
        });
      }
    }
  }, []);

  // Simple state router
  const view = useMemo(() => {
    if (!session) {
      if (currentPage === "login") return <Login onNavigate={(p) => setCurrentPage(p)} />;
      return <LandingPage onNavigate={(p) => setCurrentPage(p)} />;
    }

    if (session.role === "user") {
      switch (currentPage) {
        case "orders":
          return <OrdersPage role="user" />;
        case "canteen":
          return selectedCanteenId ? (
            <CanteenDetail 
              id={selectedCanteenId} 
              onBack={() => setCurrentPage("home")} 
              onGoToOrders={() => setCurrentPage("orders")}
            />
          ) : <StudentDashboard onSelectCanteen={(id) => { setSelectedCanteenId(id); setCurrentPage("canteen"); }} />;
        case "home":
        default:
          return <StudentDashboard onSelectCanteen={(id) => { setSelectedCanteenId(id); setCurrentPage("canteen"); }} />;
      }
    } else {
      switch (currentPage) {
        case "orders":
          return <OrdersPage role="kantin" />;
        case "home":
        default:
          return <CanteenDashboard />;
      }
    }
  }, [session, currentPage, selectedCanteenId]);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        {view}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-32">
      {/* Centered Logo Header */}
      <header className="flex flex-col items-center pt-12 pb-8">
        <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl shadow-slate-900/20">
          <Store size={24} className="text-emerald-400" />
          <h1 className="text-xl font-bold uppercase tracking-[0.2em]">Kantinku</h1>
        </div>
      </header>

      <main className="p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {view}
        </div>
      </main>

      <FloatingNavbar 
        activeTab={currentPage === "canteen" ? "home" : currentPage} 
        onTabChange={(p) => {
          setCurrentPage(p);
          if (p !== "canteen") setSelectedCanteenId(null);
        }} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
