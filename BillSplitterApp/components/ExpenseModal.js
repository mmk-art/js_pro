import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getCategories, saveCategory, getFriends, saveFriend } from '../utils/storage';

const ExpenseModal = ({ visible, onClose, onSave, expense = null, tripId }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [friend, setFriend] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newFriendName, setNewFriendName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount?.toString() || '');
      setCategory(expense.category || 'Food');
      setFriend(expense.friend || '');
      setDescription(expense.description || '');
    } else {
      resetForm();
    }
  }, [expense, visible]);

  const loadData = async () => {
    try {
      const [categoriesData, friendsData] = await Promise.all([
        getCategories(),
        getFriends()
      ]);
      setCategories(categoriesData);
      setFriends(friendsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('Food');
    setFriend('');
    setDescription('');
  };

  const handleSave = async () => {
    if (!amount.trim() || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!friend.trim()) {
      Alert.alert('Error', 'Please select or add a friend');
      return;
    }

    const expenseData = {
      tripId,
      amount: parseFloat(amount),
      category,
      friend: friend.trim(),
      description: description.trim(),
    };

    if (expense) {
      expenseData.id = expense.id;
    }

    try {
      await onSave(expenseData);
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    try {
      const updatedCategories = await saveCategory(newCategoryName.trim());
      setCategories(updatedCategories);
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add category');
    }
  };

  const handleAddFriend = async () => {
    if (!newFriendName.trim()) {
      Alert.alert('Error', 'Please enter a friend name');
      return;
    }

    try {
      const newFriend = await saveFriend({ name: newFriendName.trim() });
      await loadData(); // Reload friends
      setFriend(newFriend.name);
      setNewFriendName('');
      setShowAddFriend(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add friend');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>
              {expense ? 'Edit Expense' : 'Add New Expense'}
            </Text>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddCategory(true)}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.selectedCategoryChip
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      category === cat && styles.selectedCategoryChipText
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Friend Selection */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Friend</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddFriend(true)}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {friends.map((f) => (
                  <TouchableOpacity
                    key={f.id}
                    style={[
                      styles.categoryChip,
                      friend === f.name && styles.selectedCategoryChip
                    ]}
                    onPress={() => setFriend(f.name)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      friend === f.name && styles.selectedCategoryChipText
                    ]}>
                      {f.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  resetForm();
                  onClose();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {expense ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Add Category Modal */}
        <Modal
          visible={showAddCategory}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddCategory(false)}
        >
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalContent}>
              <Text style={styles.subModalTitle}>Add Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setNewCategoryName('');
                    setShowAddCategory(false);
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
        </Modal>

        {/* Add Friend Modal */}
        <Modal
          visible={showAddFriend}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddFriend(false)}
        >
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalContent}>
              <Text style={styles.subModalTitle}>Add Friend</Text>
              <TextInput
                style={styles.input}
                placeholder="Friend name"
                value={newFriendName}
                onChangeText={setNewFriendName}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setNewFriendName('');
                    setShowAddFriend(false);
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
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  addButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCategoryChip: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryChipText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#ffffff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  subModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subModalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxWidth: 300,
  },
  subModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ExpenseModal;