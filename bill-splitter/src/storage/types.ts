export type UUID = string;

export type Category = {
  id: UUID;
  name: string;
};

export type Friend = {
  id: UUID;
  name: string;
};

export type Expense = {
  id: UUID;
  tripId: UUID;
  friendId: UUID;
  categoryId: UUID;
  amount: number;
  note?: string;
  createdAt: number; // epoch ms
};

export type Trip = {
  id: UUID;
  name: string;
  friends: Friend[];
  categories: Category[];
  expenses: Expense[];
  createdAt: number;
};

export type AppState = {
  trips: Trip[];
};

export type NewTripInput = {
  name: string;
  friendNames: string[];
  categoryNames?: string[];
};

export type NewExpenseInput = {
  tripId: UUID;
  friendId: UUID;
  categoryId: UUID;
  amount: number;
  note?: string;
};

export type UpdateExpenseInput = Partial<Omit<Expense, "id" | "tripId">> & {
  id: UUID;
  tripId: UUID;
};

export type UpdateTripInput = Partial<Omit<Trip, "id" | "expenses">> & {
  id: UUID;
};

export const defaultCategories: string[] = ["Food", "Travel", "Snacks", "Stay", "Misc"];

