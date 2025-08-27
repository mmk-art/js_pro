// Demo data for testing the app functionality
export const demoData = {
  trips: [
    {
      id: 'demo-trip-1',
      name: 'Mantralayam Trip',
      budget: 5000,
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: 'demo-trip-2',
      name: 'Weekend Getaway',
      budget: 3000,
      createdAt: new Date('2024-01-20').toISOString(),
    },
  ],
  
  friends: ['John', 'Sarah', 'Mike', 'Emma'],
  
  categories: ['Food', 'Travel', 'Snacks', 'Accommodation', 'Entertainment', 'Shopping'],
  
  expenses: [
    {
      id: 'demo-expense-1',
      amount: 1200,
      category: 'Food',
      friendName: 'John',
      tripId: 'demo-trip-1',
      description: 'Restaurant dinner for the group',
      createdAt: new Date('2024-01-15T18:00:00').toISOString(),
    },
    {
      id: 'demo-expense-2',
      amount: 800,
      category: 'Travel',
      friendName: 'Sarah',
      tripId: 'demo-trip-1',
      description: 'Fuel for the car',
      createdAt: new Date('2024-01-15T10:00:00').toISOString(),
    },
    {
      id: 'demo-expense-3',
      amount: 600,
      category: 'Accommodation',
      friendName: 'Mike',
      tripId: 'demo-trip-1',
      description: 'Hotel booking',
      createdAt: new Date('2024-01-14T20:00:00').toISOString(),
    },
    {
      id: 'demo-expense-4',
      amount: 300,
      category: 'Snacks',
      friendName: 'Emma',
      tripId: 'demo-trip-1',
      description: 'Snacks and beverages',
      createdAt: new Date('2024-01-15T14:00:00').toISOString(),
    },
    {
      id: 'demo-expense-5',
      amount: 400,
      category: 'Entertainment',
      friendName: 'John',
      tripId: 'demo-trip-1',
      description: 'Movie tickets',
      createdAt: new Date('2024-01-15T20:00:00').toISOString(),
    },
    {
      id: 'demo-expense-6',
      amount: 500,
      category: 'Food',
      friendName: 'Sarah',
      tripId: 'demo-trip-2',
      description: 'Lunch at cafe',
      createdAt: new Date('2024-01-20T12:00:00').toISOString(),
    },
    {
      id: 'demo-expense-7',
      amount: 200,
      category: 'Shopping',
      friendName: 'Mike',
      tripId: 'demo-trip-2',
      description: 'Souvenirs',
      createdAt: new Date('2024-01-20T16:00:00').toISOString(),
    },
  ],
};

// Function to load demo data into the app
export const loadDemoData = async (AsyncStorage) => {
  try {
    await AsyncStorage.setItem('trips', JSON.stringify(demoData.trips));
    await AsyncStorage.setItem('expenses', JSON.stringify(demoData.expenses));
    await AsyncStorage.setItem('friends', JSON.stringify(demoData.friends));
    await AsyncStorage.setItem('categories', JSON.stringify(demoData.categories));
    return true;
  } catch (error) {
    console.error('Error loading demo data:', error);
    return false;
  }
};

// Function to clear all data
export const clearAllData = async (AsyncStorage) => {
  try {
    await AsyncStorage.multiRemove(['trips', 'expenses', 'friends', 'categories']);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};