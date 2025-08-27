import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useData } from '../context/DataContext';

const { width, height } = Dimensions.get('window');

const ExpenseModal = ({ route, navigation }) => {
  const { tripId, tripName, expenseId } = route.params || {};
  const {
    categories,
    friends,
    addFriend,
    addExpense,
    updateExpense,
    expenses,
    addCategory,
  } = useData();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [friendName, setFriendName] = useState('');
  const [description, setDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newFriend, setNewFriend] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const isEditing = !!expenseId;
  const expense = isEditing ? expenses.find(e => e.id === expenseId) : null;

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setFriendName(expense.friendName);
      setDescription(expense.description || '');
    }
  }, [expense]);

  const handleSave = () => {
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!friendName.trim()) {
      Alert.alert('Error', 'Please select a friend');
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      category: category.trim(),
      friendName: friendName.trim(),
      tripId,
      description: description.trim(),
    };

    if (isEditing) {
      updateExpense(expenseId, expenseData);
    } else {
      addExpense(expenseData);
    }

    navigation.goBack();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      Alert.alert('Error', 'Category already exists');
      return;
    }

    addCategory(newCategory.trim());
    setCategory(newCategory.trim());
    setNewCategory('');
    setShowAddCategory(false);
  };

  const handleAddFriend = () => {
    if (!newFriend.trim()) {
      Alert.alert('Error', 'Please enter a friend name');
      return;
    }

    if (friends.includes(newFriend.trim())) {
      Alert.alert('Error', 'Friend already exists');
      return;
    }

    addFriend(newFriend.trim());
    setFriendName(newFriend.trim());
    setNewFriend('');
    setShowAddFriend(false);
  };

  const renderCategoryItem = (cat) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.selectionItem,
        category === cat && styles.selectedItem
      ]}
      onPress={() => setCategory(cat)}
    >
      <Text style={[
        styles.selectionItemText,
        category === cat && styles.selectedItemText
      ]}>
        {cat}
      </Text>
    </TouchableOpacity>
  );

  const renderFriendItem = (friend) => (
    <TouchableOpacity
      key={friend}
      style={[
        styles.selectionItem,
        friendName === friend && styles.selectedItem
      ]}
      onPress={() => setFriendName(friend)}
    >
      <Text style={[
        styles.selectionItemText,
        friendName === friend && styles.selectedItemText
      ]}>
        👤 {friend}
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
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Expense' : 'Add New Expense'}
          </Text>
          <Text style={styles.headerSubtitle}>{tripName}</Text>
        </View>

        <View style={styles.form}>
          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (₹)</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              autoFocus={!isEditing}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectionContainer}
            >
              {categories.map(renderCategoryItem)}
              
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddCategory(true)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Friend Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Friend</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectionContainer}
            >
              {friends.map(renderFriendItem)}
              
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddFriend(true)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="What was this expense for?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Category Modal */}
      {showAddCategory && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Category Name"
              value={newCategory}
              onChangeText={setNewCategory}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddCategory(false);
                  setNewCategory('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Add Friend Modal */}
      {showAddFriend && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Friend</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Friend Name"
              value={newFriend}
              onChangeText={setNewFriend}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddFriend(false);
                  setNewFriend('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddFriend}
              >
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 24,
    backgroundColor: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#007AFF',
  },
  selectionContainer: {
    paddingRight: 20,
  },
  selectionItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectionItemText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedItemText: {
    color: 'white',
  },
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4CAF50',
    minWidth: 50,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: width * 0.8,
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  modalInput: {
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
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});

export default ExpenseModal;