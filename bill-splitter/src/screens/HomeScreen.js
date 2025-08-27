import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../contexts/DataContext';
import TripCard from '../components/TripCard';
import { loadDemoData } from '../utils/demoData';

const HomeScreen = ({ navigation }) => {
  const { 
    trips, 
    getTotalBudget, 
    getTotalSpentOverall, 
    loading,
    saveTrips,
    saveExpenses,
    saveFriends
  } = useData();
  const [showAddTrip, setShowAddTrip] = useState(false);

  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpentOverall();
  const remainingBudget = totalBudget - totalSpent;

  const handleTripPress = (trip) => {
    navigation.navigate('Trip', { tripId: trip.id, tripName: trip.name });
  };

  const handleAddTrip = () => {
    navigation.navigate('AddTripModal');
  };

  const handleLoadDemoData = async () => {
    try {
      const success = await loadDemoData({ saveTrips, saveExpenses, saveFriends });
      if (success) {
        Alert.alert('Success', 'Demo data loaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to load demo data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load demo data');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Budget Summary */}
      <View style={styles.header}>
        <Text style={styles.title}>Bill Splitter</Text>
        <View style={styles.budgetContainer}>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Total Budget</Text>
            <Text style={styles.budgetAmount}>₹{totalBudget.toFixed(2)}</Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Total Spent</Text>
            <Text style={styles.budgetAmount}>₹{totalSpent.toFixed(2)}</Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Remaining</Text>
            <Text style={[
              styles.budgetAmount,
              { color: remainingBudget >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              ₹{remainingBudget.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Trips List */}
      <ScrollView style={styles.tripsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Trips</Text>
          {trips.length === 0 && (
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={handleLoadDemoData}
            >
              <Text style={styles.demoButtonText}>Load Demo Data</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No trips yet</Text>
            <Text style={styles.emptySubtext}>Create your first trip to get started</Text>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={handleLoadDemoData}
            >
              <Text style={styles.demoButtonText}>Load Demo Data</Text>
            </TouchableOpacity>
          </View>
        ) : (
          trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPress={() => handleTripPress(trip)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTrip}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  tripsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  demoButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default HomeScreen;