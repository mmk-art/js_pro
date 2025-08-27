import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import TripScreen from './src/screens/TripScreen';
import FriendSummaryScreen from './src/screens/FriendSummaryScreen';
import ExpenseModal from './src/components/ExpenseModal';
import AddTripModal from './src/components/AddTripModal';

// Import context
import { DataProvider } from './src/contexts/DataContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Trips') {
            iconName = focused ? 'map' : 'map-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trips" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <DataProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Trip" 
            component={TripScreen}
            options={({ route }) => ({ title: route.params?.tripName || 'Trip Details' })}
          />
          <Stack.Screen 
            name="FriendSummary" 
            component={FriendSummaryScreen}
            options={({ route }) => ({ title: route.params?.friendName || 'Friend Summary' })}
          />
          <Stack.Screen 
            name="ExpenseModal" 
            component={ExpenseModal}
            options={{ 
              presentation: 'modal',
              title: 'Add/Edit Expense'
            }}
          />
          <Stack.Screen 
            name="AddTripModal" 
            component={AddTripModal}
            options={{ 
              presentation: 'modal',
              title: 'Add New Trip'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}
