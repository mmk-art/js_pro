import React from "react";
import { NavigationContainer, DefaultTheme, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { TripScreen } from "../screens/TripScreen";
import { FriendSummaryScreen } from "../screens/FriendSummaryScreen";
import { ExpenseModal } from "../screens/ExpenseModal";

export type RootStackParamList = {
  Home: undefined;
  Trip: { tripId: string };
  FriendSummary: { tripId: string; friendId: string };
  ExpenseModal: { tripId: string; expenseId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f8fafc",
  },
};

export const RootNavigation: React.FC = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Trips" }} />
        <Stack.Screen name="Trip" component={TripScreen} options={{ title: "Trip" }} />
        <Stack.Screen name="FriendSummary" component={FriendSummaryScreen} options={{ title: "Friend" }} />
        <Stack.Screen name="ExpenseModal" component={ExpenseModal} options={{ presentation: "modal", title: "Expense" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

