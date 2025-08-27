# Bill Splitter (React Native + Expo)

## Stack
- React Native (Expo SDK 53)
- TypeScript
- AsyncStorage for offline persistence
- React Navigation (native stack)

## Features
- Home: Total budget across trips, list of trips, add trip via FAB
- Trip: Total spent, category chips, add custom categories, expense list with Edit/Delete
- Expense Modal: Add/Edit expense (amount, friend, category, note)
- Friend Summary: Total spent by friend with category breakdown
- All data stored offline in AsyncStorage; no auth or network needed

## Run
```bash
cd /workspace/bill-splitter
npm install
npm run web
```

Alternatively, run on Android or iOS:
```bash
npm run android
npm run ios
```

## Usage Tips
- Add a trip: Press + once to reveal fields, press + again to save
- Add expense: Inside a trip, press + and select Friend & Category chips
- Add custom category: Type a name in the field under the chips and tap Add
- Delete trip: Use the Delete Trip action on the Trip screen

## Project Structure
```
src/
  components/      # Card, FAB, CategoryTabs
  navigation/      # Root navigation (stack)
  screens/         # Home, Trip, ExpenseModal, FriendSummary
  storage/         # Types, AsyncStorage helpers, AppProvider context
```