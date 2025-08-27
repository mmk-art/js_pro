import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Trip } from "./types";

const STORAGE_KEY = "bill_splitter_app_state_v1";

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { trips: [] };
    }
    const parsed: AppState = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.warn("Failed to load state", error);
    return { trips: [] };
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    const payload = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, payload);
  } catch (error) {
    console.warn("Failed to save state", error);
  }
}

export function calculateTripTotal(trip: Trip): number {
  return trip.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

