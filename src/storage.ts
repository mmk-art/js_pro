import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Trip, Expense } from './types';

const STORAGE_KEY = 'BILL_SPLITTER_APP_DATA_V1';

export async function loadData(): Promise<AppData> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return { trips: [] };
    return JSON.parse(json);
  } catch (error) {
    return { trips: [] };
  }
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export function calculateTripTotal(trip: Trip): number {
  return trip.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

export function calculateFriendTotal(trip: Trip, friendName: string): number {
  return trip.expenses
    .filter((e) => e.friendName === friendName)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function categoryBreakdownForFriend(trip: Trip, friendName: string): Record<string, number> {
  return trip.expenses
    .filter((e) => e.friendName === friendName)
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
}

