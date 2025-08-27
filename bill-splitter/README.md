# Bill Splitter App

A comprehensive React Native + Expo bill-splitting application that helps you manage shared expenses with friends during trips and group activities. The app works completely offline and stores all data locally using AsyncStorage.

## Features

### 🏠 Home Screen
- **Total Budget Overview**: View your total budget, amount spent, and remaining budget
- **Trip Management**: Create and manage multiple trips/groups
- **Quick Access**: Easy navigation to trip details
- **Floating Action Button**: Add new trips with a single tap

### 🧳 Trip Screen
- **Trip Details**: View trip budget, total spent, and remaining amount
- **Category Tabs**: Horizontal scrolling tabs for different expense categories
- **Expense List**: View all expenses added by friends
- **Category Management**: Add custom categories on the fly
- **Expense Management**: Delete expenses with confirmation

### 💰 Expense Management
- **Add Expenses**: Quick expense entry with amount, category, and friend selection
- **Category Selection**: Choose from predefined or custom categories
- **Friend Selection**: Select from existing friends or add new ones
- **Description**: Optional description field for expense details
- **Edit Mode**: Modify existing expenses

### 👥 Friend Summary
- **Individual Tracking**: View total amount spent by each friend
- **Category Breakdown**: See spending patterns by category with percentages
- **Visual Progress**: Progress bars showing category distribution
- **Filtered View**: Filter expenses by category
- **Trip Context**: View friend expenses for specific trips or overall

### 🎨 UI/UX Features
- **Modern Design**: Clean, card-based interface with shadows and rounded corners
- **Responsive Layout**: Adapts to different screen sizes
- **Color Coding**: Visual indicators for budget status and categories
- **Smooth Navigation**: Intuitive navigation between screens
- **Floating Action Buttons**: Consistent add actions across the app

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **AsyncStorage**: Local data persistence
- **React Navigation**: Screen navigation and routing
- **Context API**: State management and data sharing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Setup Steps

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
   ```

4. **Run on device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press 'a' for Android emulator or 'i' for iOS simulator

## Usage Guide

### Creating Your First Trip

1. **Open the app** and tap the floating + button
2. **Enter trip details**:
   - Trip name (e.g., "Mantralayam Trip")
   - Budget amount
   - Friend names (comma-separated, optional)
3. **Tap "Add Trip"** to create the trip

### Adding Expenses

1. **Navigate to a trip** by tapping on its card
2. **Tap the + button** to add a new expense
3. **Fill in expense details**:
   - Amount
   - Category (select from existing or add new)
   - Friend (select from existing or add new)
   - Description (optional)
4. **Tap "Save"** to add the expense

### Managing Categories

- **Add new categories**: Tap the + button in the category selection
- **Delete categories**: Long-press on a category tab (except "All")
- **Custom categories**: Create categories specific to your needs

### Tracking Friend Expenses

1. **Tap on a friend's name** in any expense
2. **View detailed breakdown**:
   - Total amount spent
   - Category-wise breakdown with percentages
   - List of all expenses
   - Filter by categories

### Data Management

- **All data is stored locally** on your device
- **No internet connection required** - works completely offline
- **Automatic persistence** - data is saved automatically
- **No account setup** - start using immediately

## Data Structure

### Trip Object
```javascript
{
  id: "unique_id",
  name: "Trip Name",
  budget: 1000.00,
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Expense Object
```javascript
{
  id: "unique_id",
  amount: 50.00,
  category: "Food",
  friendName: "John",
  tripId: "trip_id",
  description: "Lunch at restaurant",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Categories
- Predefined: Food, Travel, Snacks, Accommodation, Entertainment, Shopping
- Custom: User-defined categories

## Features in Detail

### Offline-First Design
- Works without internet connection
- All data stored locally using AsyncStorage
- Automatic data persistence
- No authentication required

### Smart Budget Tracking
- Real-time budget calculations
- Visual indicators for budget status
- Remaining budget warnings
- Trip-wise budget management

### Flexible Category System
- Add unlimited custom categories
- Delete unused categories
- Category-based expense filtering
- Visual category breakdowns

### Friend Management
- Add friends dynamically
- Track individual spending
- Category-wise friend analysis
- Trip-specific friend tracking

## Customization

### Adding New Features
The app is built with a modular architecture:
- `src/context/DataContext.js` - Data management and business logic
- `src/screens/` - Screen components
- `src/components/` - Reusable UI components
- `src/utils/` - Utility functions

### Styling
- Consistent design system with predefined colors
- Easy to modify themes and styles
- Responsive design patterns
- Platform-specific optimizations

## Troubleshooting

### Common Issues

1. **App not starting**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Clear npm cache if needed

2. **Data not persisting**
   - Check AsyncStorage permissions
   - Verify device storage availability
   - Restart the app

3. **Performance issues**
   - Limit the number of expenses per trip
   - Use category filtering for large datasets
   - Consider data cleanup for old trips

### Development Tips

- Use Expo Go for rapid development
- Enable hot reloading for faster iteration
- Test on both iOS and Android devices
- Monitor AsyncStorage usage for large datasets

## Future Enhancements

- **Data Export**: Export trip data to CSV/PDF
- **Split Calculations**: Automatic bill splitting algorithms
- **Photo Attachments**: Add receipts and photos to expenses
- **Cloud Sync**: Optional cloud backup and sharing
- **Multi-currency**: Support for different currencies
- **Payment Tracking**: Track who paid what and who owes whom

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions, issues, or feature requests, please open an issue in the repository.

---

**Happy Bill Splitting! 🎉**