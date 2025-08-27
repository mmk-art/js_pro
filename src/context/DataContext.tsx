import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { AppData, Trip, Expense, DEFAULT_CATEGORIES } from '../types';
import { loadData, saveData, generateId } from '../storage';

type DataContextValue = {
  trips: Trip[];
  reload: () => Promise<void>;
  createTrip: (name: string, budgetAmount?: number) => Promise<string>;
  updateTrip: (trip: Trip) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  addCategory: (tripId: string, category: string) => Promise<void>;
  addFriend: (tripId: string, friendName: string) => Promise<void>;
  addExpense: (tripId: string, expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<string>;
  updateExpense: (tripId: string, expenseId: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (tripId: string, expenseId: string) => Promise<void>;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({ trips: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const loadedData = await loadData();
      setData(loadedData);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveData(data);
  }, [data, loaded]);

  const value = useMemo<DataContextValue>(() => ({
    trips: data.trips,
    reload: async () => {
      const next = await loadData();
      setData(next);
    },
    createTrip: async (name: string, budgetAmount?: number) => {
      const id = generateId('trip');
      const newTrip: Trip = {
        id,
        name,
        budgetAmount,
        friends: [],
        categories: [...DEFAULT_CATEGORIES],
        expenses: []
      };
      setData((prev) => ({ trips: [newTrip, ...prev.trips] }));
      return id;
    },
    updateTrip: async (trip: Trip) => {
      setData((prev) => ({ trips: prev.trips.map((t) => (t.id === trip.id ? trip : t)) }));
    },
    deleteTrip: async (tripId: string) => {
      setData((prev) => ({ trips: prev.trips.filter((t) => t.id !== tripId) }));
    },
    addCategory: async (tripId: string, category: string) => {
      setData((prev) => ({
        trips: prev.trips.map((t) =>
          t.id === tripId && !t.categories.includes(category)
            ? { ...t, categories: [...t.categories, category] }
            : t
        )
      }));
    },
    addFriend: async (tripId: string, friendName: string) => {
      const trimmed = friendName.trim();
      if (!trimmed) return;
      setData((prev) => ({
        trips: prev.trips.map((t) =>
          t.id === tripId && !t.friends.includes(trimmed)
            ? { ...t, friends: [...t.friends, trimmed] }
            : t
        )
      }));
    },
    addExpense: async (tripId: string, expense: Omit<Expense, 'id' | 'createdAt'>) => {
      const id = generateId('exp');
      const createdAt = Date.now();
      setData((prev) => ({
        trips: prev.trips.map((t) =>
          t.id === tripId
            ? {
                ...t,
                friends: t.friends.includes(expense.friendName)
                  ? t.friends
                  : [...t.friends, expense.friendName],
                categories: t.categories.includes(expense.category)
                  ? t.categories
                  : [...t.categories, expense.category],
                expenses: [{ id, createdAt, ...expense }, ...t.expenses]
              }
            : t
        )
      }));
      return id;
    },
    updateExpense: async (tripId: string, expenseId: string, updates: Partial<Expense>) => {
      setData((prev) => ({
        trips: prev.trips.map((t) =>
          t.id === tripId
            ? {
                ...t,
                expenses: t.expenses.map((e) =>
                  e.id === expenseId ? { ...e, ...updates, id: e.id, createdAt: e.createdAt } : e
                )
              }
            : t
        )
      }));
    },
    deleteExpense: async (tripId: string, expenseId: string) => {
      setData((prev) => ({
        trips: prev.trips.map((t) =>
          t.id === tripId ? { ...t, expenses: t.expenses.filter((e) => e.id !== expenseId) } : t
        )
      }));
    }
  }), [data, loaded]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

