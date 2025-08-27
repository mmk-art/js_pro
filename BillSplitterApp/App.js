import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import TripScreen from './screens/TripScreen';
import FriendSummaryScreen from './screens/FriendSummaryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Bill Splitter' }}
        />
        <Stack.Screen 
          name="Trip" 
          component={TripScreen} 
          options={({ route }) => ({ title: route.params?.tripName || 'Trip' })}
        />
        <Stack.Screen 
          name="FriendSummary" 
          component={FriendSummaryScreen} 
          options={({ route }) => ({ title: `${route.params?.friendName || 'Friend'} Summary` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}