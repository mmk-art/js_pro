import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import TripScreen from './src/screens/TripScreen';
import ExpenseModal from './src/screens/ExpenseModal';
import FriendSummaryScreen from './src/screens/FriendSummaryScreen';

// Import context
import { DataProvider } from './src/context/DataContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🏠</Text>
          ),
        }}
      />
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
            name="MainTabs" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Trip" 
            component={TripScreen}
            options={({ route }) => ({ title: route.params?.tripName || 'Trip' })}
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
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}
