/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "user" | "kantin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In real apps, we don't store passwords like this, but for this mockup we keep it simple
}

export interface CanteenProfile {
  id: string;
  kantinId: string;
  nama: string;
  deskripsi: string;
  kategori: string;
  fotoBanner: string; // base64
  jamBuka: string; // HH:MM
  jamTutup: string; // HH:MM
  isTutupManual: boolean;
}

export interface MenuItem {
  id: string;
  kantinId: string;
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: string;
  estimasiMenit: number;
  foto: string; // base64
  isAvailable: boolean;
  isHalal?: boolean;
}

export type OrderStatus = "Menunggu Konfirmasi" | "Sedang Disiapkan" | "Siap Diambil" | "Selesai";

export interface OrderItem {
  id: string;
  menuId: string;
  nama: string;
  harga: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  kantinId: string;
  kantinNama: string;
  items: OrderItem[];
  totalHarga: number;
  catatan: string;
  status: OrderStatus;
  waktuPesan: string; // ISO string
}

export interface Rating {
  id: string;
  userId: string;
  kantinId: string;
  orderId: string;
  bintang: number;
}

export interface Session {
  userId: string;
  role: UserRole;
}

export const STORAGE_KEYS = {
  USERS: "kantinku_users",
  SESSION: "kantinku_session",
  CANTIN_PROFILES: "kantinku_kantin_profiles",
  MENUS: "kantinku_menus",
  ORDERS: "kantinku_orders",
  RATINGS: "kantinku_ratings",
  CART: "kantinku_cart",
};
