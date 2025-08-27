import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRIPS: 'trips',
  EXPENSES: 'expenses',
  FRIENDS: 'friends',
  CATEGORIES: 'categories',
  BUDGET: 'budget'
};

// Trip operations
export const getTrips = async () => {
  try {
    const trips = await AsyncStorage.getItem(STORAGE_KEYS.TRIPS);
    return trips ? JSON.parse(trips) : [];
  } catch (error) {
    console.error('Error getting trips:', error);
    return [];
  }
};

export const saveTrip = async (trip) => {
  try {
    const trips = await getTrips();
    const newTrip = {
      id: Date.now().toString(),
      name: trip.name,
      createdAt: new Date().toISOString(),
      totalSpent: 0,
      ...trip
    };
    trips.push(newTrip);
    await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return newTrip;
  } catch (error) {
    console.error('Error saving trip:', error);
    throw error;
  }
};

export const updateTrip = async (tripId, updates) => {
  try {
    const trips = await getTrips();
    const index = trips.findIndex(trip => trip.id === tripId);
    if (index !== -1) {
      trips[index] = { ...trips[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
      return trips[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const trips = await getTrips();
    const filteredTrips = trips.filter(trip => trip.id !== tripId);
    await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(filteredTrips));
    
    // Also delete all expenses for this trip
    const expenses = await getExpenses();
    const filteredExpenses = expenses.filter(expense => expense.tripId !== tripId);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filteredExpenses));
    
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

// Expense operations
export const getExpenses = async () => {
  try {
    const expenses = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
    return expenses ? JSON.parse(expenses) : [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const getExpensesByTrip = async (tripId) => {
  try {
    const expenses = await getExpenses();
    return expenses.filter(expense => expense.tripId === tripId);
  } catch (error) {
    console.error('Error getting expenses by trip:', error);
    return [];
  }
};

export const saveExpense = async (expense) => {
  try {
    const expenses = await getExpenses();
    const newExpense = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...expense
    };
    expenses.push(newExpense);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    
    // Update trip total
    await updateTripTotal(expense.tripId);
    
    return newExpense;
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};

export const updateExpense = async (expenseId, updates) => {
  try {
    const expenses = await getExpenses();
    const index = expenses.findIndex(expense => expense.id === expenseId);
    if (index !== -1) {
      const oldTripId = expenses[index].tripId;
      expenses[index] = { ...expenses[index], ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      
      // Update trip totals
      await updateTripTotal(oldTripId);
      if (updates.tripId && updates.tripId !== oldTripId) {
        await updateTripTotal(updates.tripId);
      }
      
      return expenses[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    const expenses = await getExpenses();
    const expense = expenses.find(exp => exp.id === expenseId);
    if (!expense) return false;
    
    const filteredExpenses = expenses.filter(exp => exp.id !== expenseId);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filteredExpenses));
    
    // Update trip total
    await updateTripTotal(expense.tripId);
    
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Helper function to update trip total
const updateTripTotal = async (tripId) => {
  try {
    const expenses = await getExpensesByTrip(tripId);
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    await updateTrip(tripId, { totalSpent: total });
  } catch (error) {
    console.error('Error updating trip total:', error);
  }
};

// Friend operations
export const getFriends = async () => {
  try {
    const friends = await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS);
    return friends ? JSON.parse(friends) : [];
  } catch (error) {
    console.error('Error getting friends:', error);
    return [];
  }
};

export const saveFriend = async (friend) => {
  try {
    const friends = await getFriends();
    const newFriend = {
      id: Date.now().toString(),
      name: friend.name,
      createdAt: new Date().toISOString(),
      ...friend
    };
    friends.push(newFriend);
    await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
    return newFriend;
  } catch (error) {
    console.error('Error saving friend:', error);
    throw error;
  }
};

// Category operations
export const getCategories = async () => {
  try {
    const categories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const defaultCategories = ['Food', 'Travel', 'Snacks', 'Accommodation', 'Entertainment', 'Other'];
    return categories ? JSON.parse(categories) : defaultCategories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return ['Food', 'Travel', 'Snacks', 'Accommodation', 'Entertainment', 'Other'];
  }
};

export const saveCategory = async (categoryName) => {
  try {
    const categories = await getCategories();
    if (!categories.includes(categoryName)) {
      categories.push(categoryName);
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
    return categories;
  } catch (error) {
    console.error('Error saving category:', error);
    throw error;
  }
};

// Budget operations
export const getBudget = async () => {
  try {
    const budget = await AsyncStorage.getItem(STORAGE_KEYS.BUDGET);
    return budget ? parseFloat(budget) : 0;
  } catch (error) {
    console.error('Error getting budget:', error);
    return 0;
  }
};

export const saveBudget = async (amount) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BUDGET, amount.toString());
    return parseFloat(amount);
  } catch (error) {
    console.error('Error saving budget:', error);
    throw error;
  }
};

// Get total spent across all trips
export const getTotalSpent = async () => {
  try {
    const trips = await getTrips();
    return trips.reduce((sum, trip) => sum + (trip.totalSpent || 0), 0);
  } catch (error) {
    console.error('Error getting total spent:', error);
    return 0;
  }
};