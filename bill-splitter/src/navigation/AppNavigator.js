import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TripScreen from '../screens/TripScreen';
import FriendSummaryScreen from '../screens/FriendSummaryScreen';
import ExpenseModal from '../screens/ExpenseModal';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trips' }} />
				<Stack.Screen name="Trip" component={TripScreen} options={({ route }) => ({ title: route.params?.tripName || 'Trip' })} />
				<Stack.Screen name="FriendSummary" component={FriendSummaryScreen} options={({ route }) => ({ title: route.params?.friend || 'Friend' })} />
				<Stack.Screen name="ExpenseModal" component={ExpenseModal} options={{ presentation: 'modal', title: 'Expense' }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}