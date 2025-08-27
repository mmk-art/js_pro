# Bill Splitter App

A React Native + Expo bill-splitting application that helps you manage shared expenses during trips and group activities. The app works completely offline and stores all data locally using AsyncStorage.

## Features

### 🏠 Home Screen
- **Budget Overview**: Shows total budget, total spent, and remaining amount
- **Trip Cards**: Displays all your trips with budget progress bars
- **Quick Actions**: Floating action button to add new trips

### 🗺️ Trip Screen
- **Trip Details**: Shows trip name, creation date, and total spent
- **Category Tabs**: Horizontal tabs for different expense categories (Food, Travel, Accommodation, etc.)
- **Expenses List**: All expenses in the selected trip with friend information
- **Add Expenses**: Floating action button to add new expenses

### 💰 Expense Management
- **Add/Edit Expenses**: Modal for creating and editing expenses
- **Category Selection**: Predefined categories + custom category support
- **Friend Assignment**: Assign expenses to specific friends
- **Amount & Description**: Track expense amounts and optional descriptions

### 👥 Friend Summary
- **Individual Tracking**: See total amount spent by each friend
- **Category Breakdown**: Visual breakdown of spending by category
- **Recent Expenses**: List of recent expenses for each friend

### 🔧 Data Management
- **Offline First**: Works completely without internet connection
- **Local Storage**: All data stored using AsyncStorage
- **CRUD Operations**: Full support for adding, editing, and deleting trips/expenses
- **Data Persistence**: Data survives app restarts

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **AsyncStorage**: Local data persistence
- **React Navigation**: Screen navigation and routing
- **Expo Vector Icons**: Icon library

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bill-splitter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## Project Structure

```
bill-splitter/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TripCard.js     # Trip display card
│   │   ├── ExpenseItem.js  # Individual expense item
│   │   ├── ExpenseModal.js # Add/edit expense modal
│   │   └── AddTripModal.js # Add new trip modal
│   ├── screens/            # Main app screens
│   │   ├── HomeScreen.js   # Home screen with trips list
│   │   ├── TripScreen.js   # Trip details and expenses
│   │   └── FriendSummaryScreen.js # Friend spending summary
│   ├── contexts/           # React context for state management
│   │   └── DataContext.js  # Main data context with AsyncStorage
│   └── utils/              # Utility functions
├── App.js                  # Main app component with navigation
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Usage Guide

### Creating Your First Trip
1. Tap the floating action button (+) on the home screen
2. Enter trip name (e.g., "Mantralayam Trip")
3. Set total budget amount
4. Add friends to the trip (or add new friends)
5. Tap "Create Trip"

### Adding Expenses
1. Navigate to a trip
2. Tap the floating action button (+)
3. Enter expense amount
4. Select category (or create custom category)
5. Choose the friend who paid
6. Add optional description
7. Tap "Add Expense"

### Managing Friends
- Add new friends when creating trips
- View friend spending summaries by tapping on friend names
- Track individual spending patterns and category breakdowns

### Categories
The app comes with predefined categories:
- **Food**: Restaurant meals, groceries
- **Travel**: Transportation, fuel, tickets
- **Accommodation**: Hotels, rentals
- **Entertainment**: Activities, shows
- **Shopping**: Souvenirs, supplies
- **Snacks**: Quick bites, beverages

You can also create custom categories for specific needs.

## Data Storage

All data is stored locally using AsyncStorage:
- **Trips**: Trip information, budgets, and friend associations
- **Expenses**: Individual expense records with amounts, categories, and friend assignments
- **Friends**: Friend names and creation dates

Data is automatically saved and persists between app sessions. No internet connection is required.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Include device information and steps to reproduce

---

**Happy Bill Splitting! 🎉**