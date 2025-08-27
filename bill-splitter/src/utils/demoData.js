// Demo data for testing the app functionality
export const demoData = {
  friends: [
    { id: '1', name: 'John Doe', createdAt: new Date('2024-01-01').toISOString() },
    { id: '2', name: 'Jane Smith', createdAt: new Date('2024-01-01').toISOString() },
    { id: '3', name: 'Mike Johnson', createdAt: new Date('2024-01-01').toISOString() },
  ],
  
  trips: [
    {
      id: '1',
      name: 'Mantralayam Trip',
      budget: 5000,
      createdAt: new Date('2024-01-15').toISOString(),
      friends: ['1', '2', '3'],
    },
    {
      id: '2',
      name: 'Weekend Getaway',
      budget: 3000,
      createdAt: new Date('2024-02-01').toISOString(),
      friends: ['1', '2'],
    },
  ],
  
  expenses: [
    {
      id: '1',
      amount: 1200,
      category: 'Food',
      friendId: '1',
      tripId: '1',
      description: 'Lunch at restaurant',
      createdAt: new Date('2024-01-16').toISOString(),
    },
    {
      id: '2',
      amount: 800,
      category: 'Travel',
      friendId: '2',
      tripId: '1',
      description: 'Fuel for car',
      createdAt: new Date('2024-01-16').toISOString(),
    },
    {
      id: '3',
      amount: 1500,
      category: 'Accommodation',
      friendId: '3',
      tripId: '1',
      description: 'Hotel booking',
      createdAt: new Date('2024-01-17').toISOString(),
    },
    {
      id: '4',
      amount: 600,
      category: 'Food',
      friendId: '1',
      tripId: '1',
      description: 'Dinner',
      createdAt: new Date('2024-01-17').toISOString(),
    },
    {
      id: '5',
      amount: 400,
      category: 'Snacks',
      friendId: '2',
      tripId: '1',
      description: 'Snacks and beverages',
      createdAt: new Date('2024-01-18').toISOString(),
    },
    {
      id: '6',
      amount: 900,
      category: 'Entertainment',
      friendId: '3',
      tripId: '2',
      description: 'Movie tickets',
      createdAt: new Date('2024-02-02').toISOString(),
    },
    {
      id: '7',
      amount: 750,
      category: 'Food',
      friendId: '1',
      tripId: '2',
      description: 'Dinner at cafe',
      createdAt: new Date('2024-02-02').toISOString(),
    },
  ],
};

// Function to load demo data
export const loadDemoData = async (dataContext) => {
  try {
    // Clear existing data
    await Promise.all([
      dataContext.saveTrips([]),
      dataContext.saveExpenses([]),
      dataContext.saveFriends([]),
    ]);

    // Load demo data
    await Promise.all([
      dataContext.saveFriends(demoData.friends),
      dataContext.saveTrips(demoData.trips),
      dataContext.saveExpenses(demoData.expenses),
    ]);

    return true;
  } catch (error) {
    console.error('Error loading demo data:', error);
    return false;
  }
};