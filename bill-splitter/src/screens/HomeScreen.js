import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useData } from '../context/DataContext';
import { loadDemoData } from '../utils/demoData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { trips, getTotalBudget, getTotalSpentOverall, addTrip, addFriend } = useData();
  const [modalVisible, setModalVisible] = useState(false);
  const [tripName, setTripName] = useState('');
  const [budget, setBudget] = useState('');
  const [friendNames, setFriendNames] = useState('');

  const handleAddTrip = () => {
    if (!tripName.trim()) {
      Alert.alert('Error', 'Please enter a trip name');
      return;
    }

    if (!budget.trim() || isNaN(parseFloat(budget))) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    // Add the trip
    addTrip({ name: tripName.trim(), budget: parseFloat(budget) });

    // Add friends if provided
    if (friendNames.trim()) {
      const friends = friendNames.split(',').map(name => name.trim()).filter(name => name);
      friends.forEach(friend => addFriend(friend));
    }

    // Reset form and close modal
    setTripName('');
    setBudget('');
    setFriendNames('');
    setModalVisible(false);
  };

  const handleLoadDemoData = async () => {
    try {
      await loadDemoData(AsyncStorage);
      Alert.alert('Success', 'Demo data loaded successfully! Restart the app to see the changes.');
    } catch (error) {
      Alert.alert('Error', 'Failed to load demo data');
    }
  };

  const handleTripPress = (trip) => {
    navigation.navigate('Trip', { tripId: trip.id, tripName: trip.name });
  };

  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpentOverall();
  const remainingBudget = totalBudget - totalSpent;

  return (
    <View style={styles.container}>
      {/* Header with budget info */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bill Splitter</Text>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Total Budget</Text>
          <Text style={styles.budgetAmount}>₹{totalBudget.toFixed(2)}</Text>
          <Text style={styles.spentAmount}>Spent: ₹{totalSpent.toFixed(2)}</Text>
          <Text style={[styles.remainingAmount, { color: remainingBudget >= 0 ? '#4CAF50' : '#F44336' }]}>
            Remaining: ₹{remainingBudget.toFixed(2)}
          </Text>
        </View>
        
        {/* Demo Data Button */}
        {trips.length === 0 && (
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleLoadDemoData}
          >
            <Text style={styles.demoButtonText}>Load Demo Data</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Trip cards */}
      <ScrollView style={styles.tripsContainer} showsVerticalScrollIndicator={false}>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No trips yet!</Text>
            <Text style={styles.emptyStateSubtext}>Tap the + button to create your first trip</Text>
          </View>
        ) : (
          trips.map((trip) => {
            const tripSpent = trips.reduce((total, t) => {
              if (t.id === trip.id) {
                return total + (t.budget || 0);
              }
              return total;
            }, 0);
            
            return (
              <TouchableOpacity
                key={trip.id}
                style={styles.tripCard}
                onPress={() => handleTripPress(trip)}
              >
                <View style={styles.tripCardHeader}>
                  <Text style={styles.tripName}>{trip.name}</Text>
                  <Text style={styles.tripDate}>
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.tripCardBody}>
                  <Text style={styles.tripBudget}>Budget: ₹{trip.budget.toFixed(2)}</Text>
                  <Text style={styles.tripSpent}>Spent: ₹{tripSpent.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Trip Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Trip</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Trip Name (e.g., Mantralayam Trip)"
              value={tripName}
              onChangeText={setTripName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Budget Amount"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Friend Names (comma separated, optional)"
              value={friendNames}
              onChangeText={setFriendNames}
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddTrip}
              >
                <Text style={styles.addButtonText}>Add Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  budgetContainer: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  budgetAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  spentAmount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 3,
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripsContainer: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  tripDate: {
    fontSize: 14,
    color: '#666',
  },
  tripCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripBudget: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  tripSpent: {
    fontSize: 16,
    color: '#666',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  demoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  demoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;