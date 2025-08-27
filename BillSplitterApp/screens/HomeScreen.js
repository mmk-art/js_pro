import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTrips, saveTrip, deleteTrip, getBudget, saveBudget, getTotalSpent } from '../utils/storage';

const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [tripName, setTripName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const loadData = async () => {
    try {
      const [tripsData, budgetData, totalSpentData] = await Promise.all([
        getTrips(),
        getBudget(),
        getTotalSpent()
      ]);
      setTrips(tripsData);
      setBudget(budgetData);
      setTotalSpent(totalSpentData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddTrip = async () => {
    if (!tripName.trim()) {
      Alert.alert('Error', 'Please enter a trip name');
      return;
    }

    try {
      await saveTrip({ name: tripName.trim() });
      setTripName('');
      setShowAddTrip(false);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to add trip');
    }
  };

  const handleDeleteTrip = (tripId, tripName) => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${tripName}"? This will also delete all expenses for this trip.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip(tripId);
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete trip');
            }
          },
        },
      ]
    );
  };

  const handleSaveBudget = async () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    try {
      await saveBudget(amount);
      setBudget(amount);
      setBudgetAmount('');
      setShowBudgetModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save budget');
    }
  };

  const renderTripCard = ({ item }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => navigation.navigate('Trip', { tripId: item.id, tripName: item.name })}
      onLongPress={() => handleDeleteTrip(item.id, item.name)}
    >
      <View style={styles.tripCardHeader}>
        <Text style={styles.tripName}>{item.name}</Text>
        <Text style={styles.tripAmount}>₹{item.totalSpent?.toFixed(2) || '0.00'}</Text>
      </View>
      <Text style={styles.tripDate}>
        Created: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const remainingBudget = budget - totalSpent;

  return (
    <SafeAreaView style={styles.container}>
      {/* Budget Section */}
      <TouchableOpacity style={styles.budgetCard} onPress={() => setShowBudgetModal(true)}>
        <Text style={styles.budgetLabel}>Total Budget</Text>
        <Text style={styles.budgetAmount}>₹{budget.toFixed(2)}</Text>
        <View style={styles.budgetDetails}>
          <Text style={styles.spentText}>Spent: ₹{totalSpent.toFixed(2)}</Text>
          <Text style={[
            styles.remainingText,
            { color: remainingBudget >= 0 ? '#10b981' : '#ef4444' }
          ]}>
            Remaining: ₹{remainingBudget.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Trips Section */}
      <View style={styles.tripsSection}>
        <Text style={styles.sectionTitle}>Your Trips</Text>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No trips yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first trip</Text>
          </View>
        ) : (
          <FlatList
            data={trips}
            renderItem={renderTripCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddTrip(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Trip Modal */}
      <Modal
        visible={showAddTrip}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddTrip(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Trip</Text>
            <TextInput
              style={styles.input}
              placeholder="Trip name (e.g., Mantralayam Trip)"
              value={tripName}
              onChangeText={setTripName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setTripName('');
                  setShowAddTrip(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTrip}
              >
                <Text style={styles.saveButtonText}>Add Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Budget Modal */}
      <Modal
        visible={showBudgetModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBudgetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Budget</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter budget amount"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="numeric"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setBudgetAmount('');
                  setShowBudgetModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveBudget}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  budgetCard: {
    backgroundColor: '#6366f1',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  budgetLabel: {
    color: '#e0e7ff',
    fontSize: 14,
    fontWeight: '500',
  },
  budgetAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  spentText: {
    color: '#e0e7ff',
    fontSize: 14,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tripsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  tripAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  tripDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;