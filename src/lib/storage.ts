/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { STORAGE_KEYS } from "../types";

export const storage = {
  get: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  set: <T>(key: string, data: T[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  findOne: <T extends { id?: string; kantinId?: string; userId?: string }>(
    key: string,
    predicate: (item: T) => boolean
  ): T | null => {
    const data = storage.get<T>(key);
    return data.find(predicate) || null;
  },

  save: <T extends { id?: string }>(key: string, item: T): void => {
    const data = storage.get<T>(key);
    if (item.id) {
      const index = data.findIndex((i: any) => i.id === item.id);
      if (index !== -1) {
        data[index] = item;
      } else {
        data.push(item);
      }
    } else {
      data.push(item);
    }
    storage.set(key, data);
  },

  saveById: <T extends { id: string }>(key: string, item: T): void => {
    const data = storage.get<T>(key);
    const index = data.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      data[index] = item;
    } else {
      data.push(item);
    }
    storage.set(key, data);
  },

  delete: <T extends { id: string }>(key: string, id: string): void => {
    const data = storage.get<T>(key);
    const filtered = data.filter((i) => i.id !== id);
    storage.set(key, filtered);
  },

  // Special case for single object keys like session or cart
  getObject: <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  setObject: <T>(key: string, data: T | null): void => {
    if (data === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  },
};
