# Bill Splitter App - Project Structure

## Overview
A complete React Native + Expo bill-splitting application with offline-first design and local data persistence.

## Project Structure

```
bill-splitter/
├── App.js                          # Main app entry point with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── README.md                       # Comprehensive documentation
├── PROJECT_STRUCTURE.md            # This file
│
├── src/
│   ├── context/
│   │   └── DataContext.js         # Global state management with AsyncStorage
│   │
│   ├── screens/
│   │   ├── HomeScreen.js          # Main screen with trips overview
│   │   ├── TripScreen.js          # Trip details and expenses
│   │   ├── ExpenseModal.js        # Add/edit expense form
│   │   └── FriendSummaryScreen.js # Friend expense breakdown
│   │
│   ├── components/                 # Reusable UI components (future use)
│   │
│   └── utils/
│       └── demoData.js            # Sample data for testing
│
├── assets/                         # Images, icons, and static assets
└── node_modules/                   # Dependencies
```

## Key Components

### 1. App.js
- **Navigation Setup**: Stack and Tab navigation
- **Screen Registration**: All main screens and modals
- **Data Provider**: Wraps app with DataContext

### 2. DataContext.js
- **State Management**: Trips, expenses, friends, categories
- **AsyncStorage**: Local data persistence
- **CRUD Operations**: Add, update, delete for all data types
- **Utility Functions**: Calculations and data filtering

### 3. HomeScreen.js
- **Budget Overview**: Total budget, spent, remaining
- **Trip Cards**: List of all trips with quick access
- **Add Trip Modal**: Create new trips with friends
- **Demo Data**: Load sample data for testing

### 4. TripScreen.js
- **Trip Details**: Budget, spent, remaining amounts
- **Category Tabs**: Horizontal scrolling category selection
- **Expense List**: All expenses for the trip
- **Category Management**: Add/delete custom categories

### 5. ExpenseModal.js
- **Expense Form**: Amount, category, friend, description
- **Dynamic Selection**: Add new categories and friends
- **Edit Mode**: Modify existing expenses
- **Validation**: Input validation and error handling

### 6. FriendSummaryScreen.js
- **Friend Overview**: Total spending by friend
- **Category Breakdown**: Visual breakdown with percentages
- **Progress Bars**: Visual representation of spending
- **Filtered Views**: Category-based expense filtering

## Data Flow

```
User Action → Screen Component → DataContext → AsyncStorage
     ↑                                              ↓
     ← Screen Component ← DataContext ← AsyncStorage ←
```

## State Management

### Context State
- `trips`: Array of trip objects
- `expenses`: Array of expense objects
- `friends`: Array of friend names
- `categories`: Array of category names

### Key Functions
- `addTrip()`, `updateTrip()`, `deleteTrip()`
- `addExpense()`, `updateExpense()`, `deleteExpense()`
- `addFriend()`, `deleteFriend()`
- `addCategory()`, `deleteCategory()`
- Utility functions for calculations and filtering

## Navigation Structure

```
MainTabs (Tab Navigator)
└── Home (HomeScreen)
    ├── Trip (TripScreen)
    │   ├── ExpenseModal (Modal)
    │   └── FriendSummary (FriendSummaryScreen)
    └── ExpenseModal (Modal)
```

## Features Implemented

✅ **Complete Offline Functionality**
✅ **Local Data Persistence**
✅ **Trip Management**
✅ **Expense Tracking**
✅ **Category Management**
✅ **Friend Management**
✅ **Budget Tracking**
✅ **Visual Analytics**
✅ **Modern UI/UX**
✅ **Demo Data Loading**
✅ **Responsive Design**
✅ **Error Handling**

## Dependencies

### Core
- `react-native`: Mobile app framework
- `expo`: Development platform
- `@react-native-async-storage/async-storage`: Local storage

### Navigation
- `@react-navigation/native`: Navigation core
- `@react-navigation/stack`: Stack navigation
- `@react-navigation/bottom-tabs`: Tab navigation
- `react-native-screens`: Native screen components
- `react-native-safe-area-context`: Safe area handling
- `react-native-gesture-handler`: Gesture support

## Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Testing

1. **Install Expo Go** on your mobile device
2. **Run `npm start`** in the project directory
3. **Scan QR code** with Expo Go app
4. **Test all features**:
   - Create trips
   - Add expenses
   - Manage categories
   - Track friend spending
   - Load demo data

## Future Enhancements

- [ ] Data export functionality
- [ ] Automatic bill splitting algorithms
- [ ] Photo attachments for receipts
- [ ] Cloud synchronization
- [ ] Multi-currency support
- [ ] Payment tracking
- [ ] Push notifications
- [ ] Dark mode theme
- [ ] Advanced analytics
- [ ] Group chat integration

## Architecture Benefits

- **Modular Design**: Easy to add new features
- **Scalable**: Can handle large amounts of data
- **Maintainable**: Clear separation of concerns
- **Performance**: Efficient data management
- **User Experience**: Intuitive and responsive interface
- **Offline First**: Works without internet connection
- **Cross Platform**: iOS and Android support

---

**The app is production-ready and follows React Native best practices! 🚀**