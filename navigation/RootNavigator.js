import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import TripScreen from '../screens/TripScreen';
import ExpenseModal from '../screens/ExpenseModal';
import FriendSummaryScreen from '../screens/FriendSummaryScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Trip" component={TripScreen} />
      <Stack.Screen 
        name="ExpenseModal" 
        component={ExpenseModal}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen name="FriendSummary" component={FriendSummaryScreen} />
    </Stack.Navigator>
  );
}