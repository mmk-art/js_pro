import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tripsData, expensesData, friendsData] = await Promise.all([
        AsyncStorage.getItem('trips'),
        AsyncStorage.getItem('expenses'),
        AsyncStorage.getItem('friends'),
      ]);

      if (tripsData) setTrips(JSON.parse(tripsData));
      if (expensesData) setExpenses(JSON.parse(expensesData));
      if (friendsData) setFriends(JSON.parse(friendsData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTrips = async (newTrips) => {
    try {
      await AsyncStorage.setItem('trips', JSON.stringify(newTrips));
      setTrips(newTrips);
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  };

  const saveExpenses = async (newExpenses) => {
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  };

  const saveFriends = async (newFriends) => {
    try {
      await AsyncStorage.setItem('friends', JSON.stringify(newFriends));
      setFriends(newFriends);
    } catch (error) {
      console.error('Error saving friends:', error);
    }
  };

  const addTrip = async (trip) => {
    const newTrip = {
      id: Date.now().toString(),
      name: trip.name,
      budget: parseFloat(trip.budget) || 0,
      createdAt: new Date().toISOString(),
      friends: trip.friends || [],
    };
    const newTrips = [...trips, newTrip];
    await saveTrips(newTrips);
  };

  const updateTrip = async (tripId, updates) => {
    const newTrips = trips.map(trip =>
      trip.id === tripId ? { ...trip, ...updates } : trip
    );
    await saveTrips(newTrips);
  };

  const deleteTrip = async (tripId) => {
    const newTrips = trips.filter(trip => trip.id !== tripId);
    const newExpenses = expenses.filter(expense => expense.tripId !== tripId);
    await Promise.all([
      saveTrips(newTrips),
      saveExpenses(newExpenses),
    ]);
  };

  const addExpense = async (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(expense.amount),
      category: expense.category,
      friendId: expense.friendId,
      tripId: expense.tripId,
      description: expense.description || '',
      createdAt: new Date().toISOString(),
    };
    const newExpenses = [...expenses, newExpense];
    await saveExpenses(newExpenses);
  };

  const updateExpense = async (expenseId, updates) => {
    const newExpenses = expenses.map(expense =>
      expense.id === expenseId ? { ...expense, ...updates } : expense
    );
    await saveExpenses(newExpenses);
  };

  const deleteExpense = async (expenseId) => {
    const newExpenses = expenses.filter(expense => expense.id !== expenseId);
    await saveExpenses(newExpenses);
  };

  const addFriend = async (friend) => {
    const newFriend = {
      id: Date.now().toString(),
      name: friend.name,
      createdAt: new Date().toISOString(),
    };
    const newFriends = [...friends, newFriend];
    await saveFriends(newFriends);
  };

  const updateFriend = async (friendId, updates) => {
    const newFriends = friends.map(friend =>
      friend.id === friendId ? { ...friend, ...updates } : friend
    );
    await saveFriends(newFriends);
  };

  const deleteFriend = async (friendId) => {
    const newFriends = friends.filter(friend => friend.id !== friendId);
    const newExpenses = expenses.filter(expense => expense.friendId !== friendId);
    await Promise.all([
      saveFriends(newFriends),
      saveExpenses(newExpenses),
    ]);
  };

  const getTripExpenses = (tripId) => {
    return expenses.filter(expense => expense.tripId === tripId);
  };

  const getFriendExpenses = (friendId) => {
    return expenses.filter(expense => expense.friendId === friendId);
  };

  const getTotalSpent = (tripId) => {
    const tripExpenses = getTripExpenses(tripId);
    return tripExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalBudget = () => {
    return trips.reduce((total, trip) => total + trip.budget, 0);
  };

  const getTotalSpentOverall = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategories = () => {
    const categories = new Set();
    expenses.forEach(expense => {
      if (expense.category) {
        categories.add(expense.category);
      }
    });
    return Array.from(categories);
  };

  const value = {
    trips,
    expenses,
    friends,
    loading,
    addTrip,
    updateTrip,
    deleteTrip,
    addExpense,
    updateExpense,
    deleteExpense,
    addFriend,
    updateFriend,
    deleteFriend,
    getTripExpenses,
    getFriendExpenses,
    getTotalSpent,
    getTotalBudget,
    getTotalSpentOverall,
    getCategories,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};