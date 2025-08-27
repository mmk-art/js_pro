import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../contexts/DataContext';

const AddTripModal = ({ navigation }) => {
  const { friends, addTrip, addFriend } = useData();
  
  const [tripName, setTripName] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);

  const handleSave = async () => {
    if (!tripName.trim()) {
      Alert.alert('Error', 'Please enter a trip name');
      return;
    }

    if (!budget || parseFloat(budget) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    try {
      const tripData = {
        name: tripName.trim(),
        budget: parseFloat(budget),
        friends: selectedFriends,
      };

      await addTrip(tripData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create trip');
    }
  };

  const handleAddFriend = async () => {
    if (!newFriendName.trim()) {
      Alert.alert('Error', 'Please enter a friend name');
      return;
    }

    try {
      await addFriend({ name: newFriendName.trim() });
      setNewFriendName('');
      setShowAddFriend(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add friend');
    }
  };

  const toggleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const renderFriendOption = (friend) => (
    <TouchableOpacity
      key={friend.id}
      style={[
        styles.friendOption,
        selectedFriends.includes(friend.id) && styles.friendOptionSelected
      ]}
      onPress={() => toggleFriendSelection(friend.id)}
    >
      <Text style={[
        styles.friendOptionText,
        selectedFriends.includes(friend.id) && styles.friendOptionTextSelected
      ]}>
        {friend.name}
      </Text>
      {selectedFriends.includes(friend.id) && (
        <Ionicons name="checkmark" size={16} color="white" />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Trip</Text>
        </View>

        {/* Trip Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Trip Name *</Text>
          <TextInput
            style={styles.textInput}
            value={tripName}
            onChangeText={setTripName}
            placeholder="e.g., Mantralayam Trip"
            autoFocus
          />
        </View>

        {/* Budget Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Budget *</Text>
          <View style={styles.budgetInput}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.textInput}
              value={budget}
              onChangeText={setBudget}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Friends Selection */}
        <View style={styles.inputGroup}>
          <View style={styles.friendsHeader}>
            <Text style={styles.label}>Select Friends</Text>
            <TouchableOpacity 
              style={styles.addFriendButton}
              onPress={() => setShowAddFriend(!showAddFriend)}
            >
              <Ionicons 
                name={showAddFriend ? "remove" : "add"} 
                size={20} 
                color="#007AFF" 
              />
              <Text style={styles.addFriendButtonText}>
                {showAddFriend ? 'Cancel' : 'Add Friend'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add New Friend */}
          {showAddFriend && (
            <View style={styles.addFriendSection}>
              <TextInput
                style={styles.textInput}
                value={newFriendName}
                onChangeText={setNewFriendName}
                placeholder="Enter friend name"
                style={[styles.textInput, styles.addFriendInput]}
              />
              <TouchableOpacity 
                style={styles.saveFriendButton}
                onPress={handleAddFriend}
              >
                <Text style={styles.saveFriendButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Friends Grid */}
          <View style={styles.friendsGrid}>
            {friends.map(renderFriendOption)}
            {friends.length === 0 && (
              <Text style={styles.noFriendsText}>
                No friends added yet. Add your first friend above.
              </Text>
            )}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!tripName.trim() || !budget) && styles.saveButtonDisabled
          ]} 
          onPress={handleSave}
          disabled={!tripName.trim() || !budget}
        >
          <Text style={styles.saveButtonText}>Create Trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  friendsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  addFriendButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  addFriendSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addFriendInput: {
    flex: 1,
  },
  saveFriendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveFriendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  friendOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 100,
    justifyContent: 'space-between',
  },
  friendOptionSelected: {
    backgroundColor: '#007AFF',
  },
  friendOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  friendOptionTextSelected: {
    color: 'white',
  },
  noFriendsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTripModal;