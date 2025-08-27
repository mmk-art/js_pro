import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingActionButton from '../components/Fab';
import TripCard from '../components/TripCard';

export default function HomeScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    loadData();
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const json = await AsyncStorage.getItem('trips');
      const storedTrips = json ? JSON.parse(json) : [];
      setTrips(storedTrips);
      const total = storedTrips.reduce((sum, t) => sum + t.totalSpent, 0);
      setTotalBudget(total);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTrip = () => {
    // navigate to a simple prompt or new Trip screen - for now just placeholder
    const newTrip = { id: Date.now().toString(), name: 'New Trip', expenses: [], totalSpent: 0 };
    const updated = [...trips, newTrip];
    setTrips(updated);
    AsyncStorage.setItem('trips', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>Total Budget: ₹{totalBudget}</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripCard trip={item} onPress={() => navigation.navigate('Trip', { tripId: item.id })} />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <FloatingActionButton onPress={handleAddTrip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
});