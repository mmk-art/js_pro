export type Expense = {
  id: string;
  amount: number;
  category: string;
  friendName: string;
  note?: string;
  createdAt: number;
};

export type Trip = {
  id: string;
  name: string;
  budgetAmount?: number;
  friends: string[];
  categories: string[];
  expenses: Expense[];
};

export type AppData = {
  trips: Trip[];
};

export const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Snacks', 'Stay', 'Misc'];

