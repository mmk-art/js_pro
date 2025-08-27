# Bill Splitter App

A React Native app built with Expo for splitting bills and tracking expenses during trips with friends.

## Features

### 🏠 Home Screen
- **Budget Management**: Set and track your total budget
- **Trip Overview**: View all your trips with total spending
- **Quick Actions**: Add new trips with floating action button
- **Real-time Updates**: See remaining budget vs total spent

### 🧳 Trip Screen
- **Category Tabs**: Filter expenses by categories (Food, Travel, Snacks, etc.)
- **Custom Categories**: Add your own expense categories
- **Friend Summary**: Quick overview of each friend's spending
- **Expense Management**: Add, edit, and delete expenses
- **Visual Breakdown**: See spending by category with totals

### 👥 Friend Summary Screen
- **Individual Tracking**: See detailed breakdown of each friend's expenses
- **Category Analysis**: Visual breakdown by spending categories
- **Statistics**: Average spending, top categories, and more
- **Expense History**: Complete list of all friend's expenses

### 💰 Expense Management
- **Smart Forms**: Easy-to-use expense entry with amount, category, friend, and description
- **Friend Management**: Add new friends on-the-fly
- **Category System**: Default categories plus custom additions
- **Edit & Delete**: Long press to delete, tap to edit expenses

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **React Navigation**: Screen navigation and routing
- **AsyncStorage**: Local data persistence (fully offline)
- **No Authentication**: Works completely offline

## Installation & Setup

1. **Install Dependencies**
   ```bash
   cd BillSplitterApp
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   # or
   expo start
   ```

3. **Run on Device/Simulator**
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press 'a' for Android emulator, 'i' for iOS simulator

## App Structure

```
BillSplitterApp/
├── App.js                     # Main navigation setup
├── screens/
│   ├── HomeScreen.js         # Budget overview and trip list
│   ├── TripScreen.js         # Trip details with expenses
│   └── FriendSummaryScreen.js # Individual friend analysis
├── components/
│   └── ExpenseModal.js       # Add/Edit expense modal
├── utils/
│   └── storage.js            # AsyncStorage operations
└── README.md
```

## Data Storage

All data is stored locally using AsyncStorage:

- **Trips**: Trip information and totals
- **Expenses**: Individual expense records
- **Friends**: Friend list for expense assignment
- **Categories**: Default and custom expense categories
- **Budget**: Overall budget amount

## Usage Guide

### Getting Started
1. **Set Your Budget**: Tap the budget card on home screen to set your total budget
2. **Create a Trip**: Use the + button to add a new trip (e.g., "Mantralayam Trip")
3. **Add Friends**: When adding expenses, you can add new friends on the fly
4. **Track Expenses**: Add expenses with amount, category, friend, and optional description

### Managing Expenses
- **Add**: Tap the + button on trip screen
- **Edit**: Tap any expense card to edit
- **Delete**: Long press any expense card to delete
- **Filter**: Use category tabs to filter by expense type

### Viewing Reports
- **Trip Overview**: See total spent per trip on home screen
- **Category Breakdown**: Use tabs on trip screen to see spending by category
- **Friend Analysis**: Tap friend names to see detailed spending breakdown
- **Budget Tracking**: Monitor remaining budget vs total spending

## Features in Detail

### Offline-First Design
- All data stored locally with AsyncStorage
- No internet connection required
- Data persists between app sessions

### Smart UI/UX
- Card-based design for easy navigation
- Consistent floating action buttons
- Intuitive tap and long-press interactions
- Real-time calculations and updates

### Flexible Categories
- Default categories: Food, Travel, Snacks, Accommodation, Entertainment, Other
- Add custom categories as needed
- Visual category tabs with spending totals

### Friend Management
- Add friends when creating expenses
- Track individual spending patterns
- Detailed friend summary screens
- Easy friend selection interface

## Development

The app uses modern React Native patterns:
- Functional components with hooks
- AsyncStorage for data persistence
- React Navigation for screen management
- Clean separation of concerns

## Future Enhancements

Potential features for future versions:
- Export data to CSV/PDF
- Photo attachments for receipts
- Split expenses between multiple friends
- Currency conversion
- Backup/restore functionality
- Dark mode support

## Support

For issues or questions about the app, please check the code structure and AsyncStorage utility functions in `utils/storage.js` for data management operations.