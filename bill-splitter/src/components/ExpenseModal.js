import React, { useState, useEffect } from 'react';
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

const ExpenseModal = ({ route, navigation }) => {
  const { 
    expenseId, 
    tripId, 
    isEditing 
  } = route.params;
  
  const { 
    expenses, 
    friends, 
    addExpense, 
    updateExpense,
    getCategories 
  } = useData();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [friendId, setFriendId] = useState('');
  const [description, setDescription] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const existingExpense = expenses.find(e => e.id === expenseId);
  const categories = ['Food', 'Travel', 'Accommodation', 'Entertainment', 'Shopping', 'Snacks'];
  const availableCategories = [...categories, ...getCategories()];

  useEffect(() => {
    if (isEditing && existingExpense) {
      setAmount(existingExpense.amount.toString());
      setCategory(existingExpense.category);
      setFriendId(existingExpense.friendId);
      setDescription(existingExpense.description || '');
    }
  }, [isEditing, existingExpense]);

  const handleSave = async () => {
    if (!amount || !category || !friendId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      category: category,
      friendId: friendId,
      tripId: tripId,
      description: description.trim(),
    };

    try {
      if (isEditing) {
        await updateExpense(expenseId, expenseData);
      } else {
        await addExpense(expenseData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleCategorySelect = (selectedCategory) => {
    if (selectedCategory === 'Custom') {
      setCategory(customCategory);
    } else {
      setCategory(selectedCategory);
    }
  };

  const renderCategoryOption = (cat) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.categoryOption,
        category === cat && styles.categoryOptionSelected
      ]}
      onPress={() => handleCategorySelect(cat)}
    >
      <Text style={[
        styles.categoryOptionText,
        category === cat && styles.categoryOptionTextSelected
      ]}>
        {cat}
      </Text>
    </TouchableOpacity>
  );

  const renderFriendOption = (friend) => (
    <TouchableOpacity
      key={friend.id}
      style={[
        styles.friendOption,
        friendId === friend.id && styles.friendOptionSelected
      ]}
      onPress={() => setFriendId(friend.id)}
    >
      <Text style={[
        styles.friendOptionText,
        friendId === friend.id && styles.friendOptionTextSelected
      ]}>
        {friend.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </Text>
          {isEditing && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
            </TouchableOpacity>
          )}
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount *</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.textInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              autoFocus={!isEditing}
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoriesGrid}>
            {availableCategories.map(renderCategoryOption)}
            <TouchableOpacity
              style={[
                styles.categoryOption,
                category === customCategory && customCategory && styles.categoryOptionSelected
              ]}
              onPress={() => setCategory(customCategory)}
            >
              <Text style={styles.categoryOptionText}>Custom</Text>
            </TouchableOpacity>
          </View>
          {category === 'Custom' && (
            <TextInput
              style={styles.textInput}
              value={customCategory}
              onChangeText={setCustomCategory}
              placeholder="Enter custom category"
              style={[styles.textInput, styles.customCategoryInput]}
            />
          )}
        </View>

        {/* Friend Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Friend *</Text>
          <View style={styles.friendsGrid}>
            {friends.map(renderFriendOption)}
          </View>
          {friends.length === 0 && (
            <Text style={styles.noFriendsText}>
              No friends added yet. Please add friends first.
            </Text>
          )}
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a description..."
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!amount || !category || !friendId) && styles.saveButtonDisabled
          ]} 
          onPress={handleSave}
          disabled={!amount || !category || !friendId}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    padding: 8,
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
  amountInput: {
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  customCategoryInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
    alignItems: 'center',
  },
  categoryOptionSelected: {
    backgroundColor: '#007AFF',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: 'white',
  },
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  friendOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
    alignItems: 'center',
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
  descriptionInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlignVertical: 'top',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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

export default ExpenseModal;