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
  const [categories, setCategories] = useState([
    'Food', 'Travel', 'Snacks', 'Accommodation', 'Entertainment', 'Shopping'
  ]);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    saveData();
  }, [trips, expenses, friends, categories]);

  const loadData = async () => {
    try {
      const [tripsData, expensesData, friendsData, categoriesData] = await Promise.all([
        AsyncStorage.getItem('trips'),
        AsyncStorage.getItem('expenses'),
        AsyncStorage.getItem('friends'),
        AsyncStorage.getItem('categories'),
      ]);

      if (tripsData) setTrips(JSON.parse(tripsData));
      if (expensesData) setExpenses(JSON.parse(expensesData));
      if (friendsData) setFriends(JSON.parse(friendsData));
      if (categoriesData) setCategories(JSON.parse(categoriesData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('trips', JSON.stringify(trips)),
        AsyncStorage.setItem('expenses', JSON.stringify(expenses)),
        AsyncStorage.setItem('friends', JSON.stringify(friends)),
        AsyncStorage.setItem('categories', JSON.stringify(categories)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Trip management
  const addTrip = (trip) => {
    const newTrip = {
      id: Date.now().toString(),
      name: trip.name,
      budget: parseFloat(trip.budget) || 0,
      createdAt: new Date().toISOString(),
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const updateTrip = (id, updates) => {
    setTrips(prev => prev.map(trip => 
      trip.id === id ? { ...trip, ...updates } : trip
    ));
  };

  const deleteTrip = (id) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
    // Also delete all expenses for this trip
    setExpenses(prev => prev.filter(expense => expense.tripId !== id));
  };

  // Expense management
  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(expense.amount) || 0,
      category: expense.category,
      friendName: expense.friendName,
      tripId: expense.tripId,
      description: expense.description || '',
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id, updates) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ));
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Friend management
  const addFriend = (friendName) => {
    if (!friends.includes(friendName)) {
      setFriends(prev => [...prev, friendName]);
    }
  };

  const deleteFriend = (friendName) => {
    setFriends(prev => prev.filter(friend => friend !== friendName));
    // Also delete all expenses for this friend
    setExpenses(prev => prev.filter(expense => expense.friendName !== friendName));
  };

  // Category management
  const addCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      setCategories(prev => [...prev, categoryName]);
    }
  };

  const deleteCategory = (categoryName) => {
    setCategories(prev => prev.filter(cat => cat !== categoryName));
  };

  // Utility functions
  const getTripExpenses = (tripId) => {
    return expenses.filter(expense => expense.tripId === tripId);
  };

  const getFriendExpenses = (friendName) => {
    return expenses.filter(expense => expense.friendName === friendName);
  };

  const getTotalSpent = (tripId) => {
    return getTripExpenses(tripId).reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalBudget = () => {
    return trips.reduce((total, trip) => total + trip.budget, 0);
  };

  const getTotalSpentOverall = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = (tripId, category) => {
    return getTripExpenses(tripId).filter(expense => expense.category === category);
  };

  const getFriendExpensesByCategory = (friendName, category) => {
    return getFriendExpenses(friendName).filter(expense => expense.category === category);
  };

  const value = {
    // State
    trips,
    expenses,
    friends,
    categories,
    
    // Trip functions
    addTrip,
    updateTrip,
    deleteTrip,
    
    // Expense functions
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Friend functions
    addFriend,
    deleteFriend,
    
    // Category functions
    addCategory,
    deleteCategory,
    
    // Utility functions
    getTripExpenses,
    getFriendExpenses,
    getTotalSpent,
    getTotalBudget,
    getTotalSpentOverall,
    getExpensesByCategory,
    getFriendExpensesByCategory,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};