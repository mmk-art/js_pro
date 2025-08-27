import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  AppState,
  Trip,
  Expense,
  NewTripInput,
  NewExpenseInput,
  UpdateExpenseInput,
  UpdateTripInput,
  Friend,
  Category,
  defaultCategories,
} from "./types";
import { loadState, saveState } from "./storage";
import { generateId } from "./id";

type AppActions = {
  addTrip: (input: NewTripInput) => void;
  updateTrip: (input: UpdateTripInput) => void;
  deleteTrip: (tripId: string) => void;
  addExpense: (input: NewExpenseInput) => void;
  updateExpense: (input: UpdateExpenseInput) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
};

type AppContextType = AppState & AppActions & { isHydrated: boolean };

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({ trips: [] });
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadState();
      setState(loaded);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    void saveState(state);
  }, [state, isHydrated]);

  const actions = useMemo<AppActions>(() => ({
    addTrip: (input: NewTripInput) => {
      const id = generateId();
      const friends: Friend[] = input.friendNames.map(name => ({ id: generateId(), name: name.trim() })).filter(f => f.name);
      const categories: Category[] = (input.categoryNames && input.categoryNames.length > 0
        ? input.categoryNames
        : defaultCategories).map(name => ({ id: generateId(), name }));
      const newTrip: Trip = {
        id,
        name: input.name.trim() || "Untitled Trip",
        friends,
        categories,
        expenses: [],
        createdAt: Date.now(),
      };
      setState(prev => ({ ...prev, trips: [newTrip, ...prev.trips] }));
    },
    updateTrip: (input: UpdateTripInput) => {
      setState(prev => ({
        ...prev,
        trips: prev.trips.map(t => (t.id === input.id ? { ...t, ...input } : t)),
      }));
    },
    deleteTrip: (tripId: string) => {
      setState(prev => ({ ...prev, trips: prev.trips.filter(t => t.id !== tripId) }));
    },
    addExpense: (input: NewExpenseInput) => {
      setState(prev => ({
        ...prev,
        trips: prev.trips.map(t => {
          if (t.id !== input.tripId) return t;
          const expense: Expense = {
            id: generateId(),
            tripId: t.id,
            friendId: input.friendId,
            categoryId: input.categoryId,
            amount: input.amount,
            note: input.note,
            createdAt: Date.now(),
          };
          return { ...t, expenses: [expense, ...t.expenses] };
        }),
      }));
    },
    updateExpense: (input: UpdateExpenseInput) => {
      setState(prev => ({
        ...prev,
        trips: prev.trips.map(t => {
          if (t.id !== input.tripId) return t;
          return {
            ...t,
            expenses: t.expenses.map(e => (e.id === input.id ? { ...e, ...input } : e)),
          };
        }),
      }));
    },
    deleteExpense: (tripId: string, expenseId: string) => {
      setState(prev => ({
        ...prev,
        trips: prev.trips.map(t => (t.id !== tripId ? t : { ...t, expenses: t.expenses.filter(e => e.id !== expenseId) })),
      }));
    },
  }), [setState]);

  const value = useMemo<AppContextType>(() => ({
    ...state,
    ...actions,
    isHydrated,
  }), [state, actions, isHydrated]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

