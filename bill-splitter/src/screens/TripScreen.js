import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../contexts/DataContext';
import ExpenseItem from '../components/ExpenseItem';

const TripScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const { 
    trips, 
    getTripExpenses, 
    getTotalSpent, 
    getCategories,
    friends 
  } = useData();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const trip = trips.find(t => t.id === tripId);
  const totalSpent = getTotalSpent(tripId);
  const categories = ['All', ...getCategories()];

  useEffect(() => {
    if (tripId) {
      const tripExpenses = getTripExpenses(tripId);
      setExpenses(tripExpenses);
      filterExpenses(tripExpenses, selectedCategory);
    }
  }, [tripId, selectedCategory]);

  const filterExpenses = (expenseList, category) => {
    if (category === 'All') {
      setFilteredExpenses(expenseList);
    } else {
      const filtered = expenseList.filter(expense => expense.category === category);
      setFilteredExpenses(filtered);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    filterExpenses(expenses, category);
  };

  const handleExpensePress = (expense) => {
    navigation.navigate('ExpenseModal', { 
      expenseId: expense.id,
      tripId: tripId,
      isEditing: true 
    });
  };

  const handleAddExpense = () => {
    navigation.navigate('ExpenseModal', { 
      tripId: tripId,
      isEditing: false 
    });
  };

  const handleFriendPress = (friendId) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      navigation.navigate('FriendSummary', { 
        friendId: friendId,
        friendName: friend.name 
      });
    }
  };

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  const renderExpenseItem = ({ item }) => (
    <ExpenseItem
      expense={item}
      friend={friends.find(f => f.id === item.friendId)}
      onPress={() => handleExpensePress(item)}
      onFriendPress={() => handleFriendPress(item.friendId)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Trip Header */}
      <View style={styles.header}>
        <View style={styles.tripInfo}>
          <Text style={styles.tripName}>{trip.name}</Text>
          <Text style={styles.tripDate}>
            Created on {new Date(trip.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.budgetInfo}>
          <Text style={styles.budgetLabel}>Total Spent</Text>
          <Text style={styles.budgetAmount}>₹{totalSpent.toFixed(2)}</Text>
          <Text style={styles.budgetSubtext}>
            of ₹{trip.budget.toFixed(2)} budget
          </Text>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Expenses List */}
      <View style={styles.expensesContainer}>
        <View style={styles.expensesHeader}>
          <Text style={styles.expensesTitle}>Expenses</Text>
          <Text style={styles.expensesCount}>
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        {filteredExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>
              {selectedCategory === 'All' 
                ? 'Add your first expense to get started' 
                : `No expenses in ${selectedCategory} category`
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.expensesList}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddExpense}>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tripInfo: {
    marginBottom: 16,
  },
  tripName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 14,
    color: '#666',
  },
  budgetInfo: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  budgetSubtext: {
    fontSize: 12,
    color: '#999',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryTabActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  expensesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expensesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  expensesCount: {
    fontSize: 14,
    color: '#666',
  },
  expensesList: {
    paddingBottom: 20,
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

export default TripScreen;