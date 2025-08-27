import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  getExpensesByTrip, 
  saveExpense, 
  updateExpense, 
  deleteExpense, 
  getCategories,
  getFriends
} from '../utils/storage';
import ExpenseModal from '../components/ExpenseModal';

const TripScreen = ({ route, navigation }) => {
  const { tripId, tripName } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);

  const loadData = async () => {
    try {
      const [expensesData, categoriesData, friendsData] = await Promise.all([
        getExpensesByTrip(tripId),
        getCategories(),
        getFriends()
      ]);
      
      setExpenses(expensesData);
      setCategories(['All', ...categoriesData]);
      setFriends(friendsData);
      
      const total = expensesData.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
      setTotalSpent(total);
    } catch (error) {
      console.error('Error loading trip data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [tripId])
  );

  const handleSaveExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
      } else {
        await saveExpense(expenseData);
      }
      setEditingExpense(null);
      loadData();
    } catch (error) {
      throw error;
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = (expenseId, amount, friend) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete this ₹${amount} expense by ${friend}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expenseId);
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const handleFriendPress = (friendName) => {
    const friendExpenses = expenses.filter(expense => expense.friend === friendName);
    navigation.navigate('FriendSummary', { 
      friendName, 
      tripId, 
      tripName,
      expenses: friendExpenses 
    });
  };

  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedCategory);

  const categoryTotals = categories.reduce((acc, category) => {
    if (category === 'All') return acc;
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const total = categoryExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    acc[category] = total;
    return acc;
  }, {});

  const friendTotals = friends.reduce((acc, friend) => {
    const friendExpenses = expenses.filter(expense => expense.friend === friend.name);
    const total = friendExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    if (total > 0) {
      acc[friend.name] = total;
    }
    return acc;
  }, {});

  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => handleEditExpense(item)}
      onLongPress={() => handleDeleteExpense(item.id, item.amount, item.friend)}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseAmount}>₹{parseFloat(item.amount).toFixed(2)}</Text>
          <Text style={styles.expenseCategory}>{item.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.friendButton}
          onPress={() => handleFriendPress(item.friend)}
        >
          <Text style={styles.friendName}>{item.friend}</Text>
        </TouchableOpacity>
      </View>
      {item.description ? (
        <Text style={styles.expenseDescription}>{item.description}</Text>
      ) : null}
      <Text style={styles.expenseDate}>
        {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Total Spent Header */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>₹{totalSpent.toFixed(2)}</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.selectedCategoryTab
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category && styles.selectedCategoryTabText
            ]}>
              {category}
              {category !== 'All' && categoryTotals[category] > 0 && (
                <Text style={styles.categoryAmount}>
                  {'\n'}₹{categoryTotals[category].toFixed(2)}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Friend Summary Cards */}
      {Object.keys(friendTotals).length > 0 && (
        <View style={styles.friendSummarySection}>
          <Text style={styles.sectionTitle}>Friend Summary</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.friendSummaryScroll}
          >
            {Object.entries(friendTotals).map(([friendName, total]) => (
              <TouchableOpacity
                key={friendName}
                style={styles.friendSummaryCard}
                onPress={() => handleFriendPress(friendName)}
              >
                <Text style={styles.friendSummaryName}>{friendName}</Text>
                <Text style={styles.friendSummaryAmount}>₹{total.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Expenses List */}
      <View style={styles.expensesSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'All Expenses' : `${selectedCategory} Expenses`}
          {filteredExpenses.length > 0 && ` (${filteredExpenses.length})`}
        </Text>
        
        {filteredExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first expense</Text>
          </View>
        ) : (
          <FlatList
            data={filteredExpenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingExpense(null);
          setShowExpenseModal(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Expense Modal */}
      <ExpenseModal
        visible={showExpenseModal}
        onClose={() => {
          setShowExpenseModal(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        expense={editingExpense}
        tripId={tripId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  totalCard: {
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
  totalLabel: {
    color: '#e0e7ff',
    fontSize: 14,
    fontWeight: '500',
  },
  totalAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  categoryTabs: {
    flexGrow: 0,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categoryTabsContent: {
    paddingRight: 16,
  },
  categoryTab: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 44,
    justifyContent: 'center',
  },
  selectedCategoryTab: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryTabText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCategoryTabText: {
    color: '#ffffff',
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  friendSummarySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  friendSummaryScroll: {
    paddingLeft: 16,
  },
  friendSummaryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  friendSummaryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  friendSummaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginTop: 4,
  },
  expensesSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  expenseCard: {
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
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
    marginTop: 2,
  },
  friendButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  friendName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  expenseDate: {
    fontSize: 12,
    color: '#9ca3af',
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
});

export default TripScreen;