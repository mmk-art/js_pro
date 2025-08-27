import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
	TRIPS: 'BS_TRIPS',
	EXPENSES: 'BS_EXPENSES',
};

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Snacks', 'Stay', 'Other'];

const DataContext = createContext(null);

function generateId(prefix = 'id') {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function DataProvider({ children }) {
	const [isHydrated, setIsHydrated] = useState(false);
	const [trips, setTrips] = useState([]);
	const [expenses, setExpenses] = useState([]);

	const persist = useCallback(async (key, value) => {
		try {
			await AsyncStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.warn('Failed to persist key', key, error);
		}
	}, []);

	const hydrate = useCallback(async () => {
		try {
			const [tripsJson, expensesJson] = await Promise.all([
				AsyncStorage.getItem(STORAGE_KEYS.TRIPS),
				AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
			]);
			setTrips(tripsJson ? JSON.parse(tripsJson) : []);
			setExpenses(expensesJson ? JSON.parse(expensesJson) : []);
		} catch (error) {
			console.warn('Failed to hydrate storage', error);
		} finally {
			setIsHydrated(true);
		}
	}, []);

	useEffect(() => {
		hydrate();
	}, [hydrate]);

	useEffect(() => {
		if (isHydrated) persist(STORAGE_KEYS.TRIPS, trips);
	}, [isHydrated, trips, persist]);

	useEffect(() => {
		if (isHydrated) persist(STORAGE_KEYS.EXPENSES, expenses);
	}, [isHydrated, expenses, persist]);

	const addTrip = useCallback((name) => {
		const newTrip = {
			id: generateId('trip'),
			name,
			categories: [...DEFAULT_CATEGORIES],
			friends: [],
			createdAt: Date.now(),
		};
		setTrips((prev) => [newTrip, ...prev]);
		return newTrip.id;
	}, []);

	const deleteTrip = useCallback((tripId) => {
		setTrips((prev) => prev.filter((t) => t.id !== tripId));
		setExpenses((prev) => prev.filter((e) => e.tripId !== tripId));
	}, []);

	const addCategoryToTrip = useCallback((tripId, categoryName) => {
		setTrips((prev) => prev.map((t) => {
			if (t.id !== tripId) return t;
			if (t.categories.includes(categoryName)) return t;
			return { ...t, categories: [...t.categories, categoryName] };
		}));
	}, []);

	const addFriendToTrip = useCallback((tripId, friendName) => {
		setTrips((prev) => prev.map((t) => {
			if (t.id !== tripId) return t;
			if (t.friends.includes(friendName)) return t;
			return { ...t, friends: [...t.friends, friendName] };
		}));
	}, []);

	const addExpense = useCallback((tripId, { amount, category, friend, note }) => {
		const numericAmount = Number(amount);
		if (!tripId || !category || !friend || Number.isNaN(numericAmount)) {
			return null;
		}
		const newExpense = {
			id: generateId('exp'),
			tripId,
			amount: numericAmount,
			category,
			friend,
			note: note || '',
			createdAt: Date.now(),
		};
		setExpenses((prev) => [newExpense, ...prev]);
		// Ensure friend and category are present in the trip
		addCategoryToTrip(tripId, category);
		addFriendToTrip(tripId, friend);
		return newExpense.id;
	}, [addCategoryToTrip, addFriendToTrip]);

	const updateExpense = useCallback((expenseId, partial) => {
		setExpenses((prev) => prev.map((e) => {
			if (e.id !== expenseId) return e;
			const next = { ...e, ...partial, amount: partial.amount !== undefined ? Number(partial.amount) : e.amount };
			return next;
		}));
		// Keep trip metadata up-to-date
		const nextExpense = expenses.find((e) => e.id === expenseId);
		if (nextExpense) {
			if (partial.category) addCategoryToTrip(nextExpense.tripId, partial.category);
			if (partial.friend) addFriendToTrip(nextExpense.tripId, partial.friend);
		}
	}, [expenses, addCategoryToTrip, addFriendToTrip]);

	const deleteExpense = useCallback((expenseId) => {
		setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
	}, []);

	const getTotalAllTrips = useCallback(() => {
		return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
	}, [expenses]);

	const getTripById = useCallback((tripId) => trips.find((t) => t.id === tripId) || null, [trips]);

	const getExpensesByTrip = useCallback((tripId) => expenses.filter((e) => e.tripId === tripId), [expenses]);

	const getTripTotal = useCallback((tripId) => {
		return expenses.filter((e) => e.tripId === tripId).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
	}, [expenses]);

	const getFriendTotalInTrip = useCallback((tripId, friendName) => {
		return expenses
			.filter((e) => e.tripId === tripId && e.friend === friendName)
			.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
	}, [expenses]);

	const getFriendBreakdownInTrip = useCallback((tripId, friendName) => {
		const byCategory = {};
		expenses
			.filter((e) => e.tripId === tripId && e.friend === friendName)
			.forEach((e) => {
				const key = e.category || 'Uncategorized';
				byCategory[key] = (byCategory[key] || 0) + (Number(e.amount) || 0);
			});
		return byCategory;
	}, [expenses]);

	const value = useMemo(() => ({
		isHydrated,
		trips,
		expenses,
		addTrip,
		deleteTrip,
		addCategoryToTrip,
		addFriendToTrip,
		addExpense,
		updateExpense,
		deleteExpense,
		getTotalAllTrips,
		getTripById,
		getExpensesByTrip,
		getTripTotal,
		getFriendTotalInTrip,
		getFriendBreakdownInTrip,
	}), [
		isHydrated,
		trips,
		expenses,
		addTrip,
		deleteTrip,
		addCategoryToTrip,
		addFriendToTrip,
		addExpense,
		updateExpense,
		deleteExpense,
		getTotalAllTrips,
		getTripById,
		getExpensesByTrip,
		getTripTotal,
		getFriendTotalInTrip,
		getFriendBreakdownInTrip,
	]);

	return (
		<DataContext.Provider value={value}>{children}</DataContext.Provider>
	);
}

export function useData() {
	const ctx = useContext(DataContext);
	if (!ctx) throw new Error('useData must be used within DataProvider');
	return ctx;
}