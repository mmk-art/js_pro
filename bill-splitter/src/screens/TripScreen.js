import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import { useData } from '../context/DataContext';

const { width } = Dimensions.get('window');

const TripScreen = ({ route, navigation }) => {
  const { tripId, tripName } = route.params;
  const {
    trips,
    getTripExpenses,
    getTotalSpent,
    categories,
    addCategory,
    deleteCategory,
    deleteExpense,
  } = useData();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const trip = trips.find(t => t.id === tripId);
  const tripExpenses = getTripExpenses(tripId);
  const totalSpent = getTotalSpent(tripId);
  const remainingBudget = (trip?.budget || 0) - totalSpent;

  // Filter expenses by selected category
  const filteredExpenses = selectedCategory === 'All' 
    ? tripExpenses 
    : tripExpenses.filter(expense => expense.category === selectedCategory);

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
    setNewCategory('');
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (category) => {
    if (category === 'All') return;
    
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category}"? This will also remove all expenses in this category.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteCategory(category);
            if (selectedCategory === category) {
              setSelectedCategory('All');
            }
          }
        },
      ]
    );
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteExpense(expenseId)
        },
      ]
    );
  };

  const handleFriendPress = (friendName) => {
    navigation.navigate('FriendSummary', { friendName, tripId });
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
      </View>
      
      <View style={styles.expenseDetails}>
        <TouchableOpacity onPress={() => handleFriendPress(item.friendName)}>
          <Text style={styles.friendName}>👤 {item.friendName}</Text>
        </TouchableOpacity>
        
        {item.description && (
          <Text style={styles.expenseDescription}>{item.description}</Text>
        )}
        
        <Text style={styles.expenseDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteExpense(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryTab = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryTab,
        selectedCategory === category && styles.selectedCategoryTab
      ]}
      onPress={() => setSelectedCategory(category)}
      onLongPress={() => category !== 'All' && handleDeleteCategory(category)}
    >
      <Text style={[
        styles.categoryTabText,
        selectedCategory === category && styles.selectedCategoryTabText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Trip Header */}
      <View style={styles.tripHeader}>
        <Text style={styles.tripTitle}>{trip.name}</Text>
        <View style={styles.budgetInfo}>
          <Text style={styles.budgetText}>Budget: ₹{trip.budget.toFixed(2)}</Text>
          <Text style={styles.spentText}>Spent: ₹{totalSpent.toFixed(2)}</Text>
          <Text style={[
            styles.remainingText,
            { color: remainingBudget >= 0 ? '#4CAF50' : '#F44336' }
          ]}>
            Remaining: ₹{remainingBudget.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {renderCategoryTab('All')}
          {categories.map(renderCategoryTab)}
          
          <TouchableOpacity
            style={styles.addCategoryTab}
            onPress={() => setShowAddCategory(true)}
          >
            <Text style={styles.addCategoryText}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Expenses List */}
      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        style={styles.expensesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No expenses yet</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedCategory === 'All' 
                ? 'Tap the + button to add your first expense'
                : `No expenses in ${selectedCategory} category`
              }
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ExpenseModal', { tripId, tripName })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Category Modal */}
      {showAddCategory && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={newCategory}
              onChangeText={setNewCategory}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowAddCategory(false);
                  setNewCategory('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tripHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 30,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  budgetInfo: {
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  spentText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  remainingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategoryTab: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryTabText: {
    color: 'white',
  },
  addCategoryTab: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  addCategoryText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  expensesList: {
    flex: 1,
    padding: 20,
  },
  expenseItem: {
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
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  expenseDetails: {
    marginBottom: 15,
  },
  friendName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default TripScreen;