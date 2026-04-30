import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User, STORAGE_KEYS } from "../types";
import { storage } from "../lib/storage";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  register: (user: User) => boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const refreshUser = () => {
    const activeSession = storage.getObject<Session>(STORAGE_KEYS.SESSION);
    if (activeSession) {
      const users = storage.get<User>(STORAGE_KEYS.USERS);
      const currentUser = users.find((u) => u.id === activeSession.userId);
      if (currentUser) {
        setUser(currentUser);
        setSession(activeSession);
      } else {
        // Session exists but user not found (deleted)
        storage.setObject(STORAGE_KEYS.SESSION, null);
        setUser(null);
        setSession(null);
      }
    } else {
      setUser(null);
      setSession(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (email: string, password?: string) => {
    const users = storage.get<User>(STORAGE_KEYS.USERS);
    // Find user by email and password
    const foundUser = users.find((u) => u.email === email && (!password || u.password === password));
    if (foundUser) {
      const newSession = { userId: foundUser.id, role: foundUser.role as any };
      storage.setObject(STORAGE_KEYS.SESSION, newSession);
      setSession(newSession);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (newUser: User) => {
    const users = storage.get<User>(STORAGE_KEYS.USERS);
    if (users.some((u) => u.email === newUser.email)) {
      return false;
    }
    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);
    
    // If it's a canteen, also initialize a default profile
    if (newUser.role === "kantin") {
      const profiles = storage.get<any>(STORAGE_KEYS.CANTIN_PROFILES);
      profiles.push({
        kantinId: newUser.id,
        nama: newUser.name,
        deskripsi: "Selamat datang di kantin kami!",
        kategori: "Semua",
        fotoBanner: "https://picsum.photos/seed/canteen/800/400",
        jamBuka: "08:00",
        jamTutup: "17:00",
        isTutupManual: false,
      });
      storage.set(STORAGE_KEYS.CANTIN_PROFILES, profiles);
    }

    return login(newUser.email, newUser.role);
  };

  const logout = () => {
    storage.setObject(STORAGE_KEYS.SESSION, null);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
