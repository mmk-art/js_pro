import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import TripScreen from './src/screens/TripScreen';
import ExpenseModal from './src/screens/ExpenseModal';
import FriendSummaryScreen from './src/screens/FriendSummaryScreen';
import { DataProvider } from './src/context/DataContext';

export type RootStackParamList = {
  Home: undefined;
  Trip: { tripId: string };
  ExpenseModal: { tripId: string; expenseId?: string };
  FriendSummary: { tripId: string; friendName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F7F7F7',
    primary: '#2563eb',
    card: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB'
  }
};

export default function App() {
  return (
    <DataProvider>
      <NavigationContainer theme={AppTheme}>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trips' }} />
          <Stack.Screen name="Trip" component={TripScreen} options={{ title: 'Trip' }} />
          <Stack.Screen
            name="FriendSummary"
            component={FriendSummaryScreen}
            options={{ title: 'Friend Summary' }}
          />
          <Stack.Screen
            name="ExpenseModal"
            component={ExpenseModal}
            options={{ presentation: 'modal', title: 'Expense' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}

