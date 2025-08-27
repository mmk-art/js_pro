import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useData } from '../context/DataContext';

const { width } = Dimensions.get('window');

const FriendSummaryScreen = ({ route }) => {
  const { friendName, tripId } = route.params;
  const { getFriendExpenses, getFriendExpensesByCategory, categories } = useData();
  
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get all expenses for this friend (optionally filtered by trip)
  const allFriendExpenses = tripId 
    ? getFriendExpenses(friendName).filter(expense => expense.tripId === tripId)
    : getFriendExpenses(friendName);

  // Filter expenses by selected category
  const filteredExpenses = selectedCategory === 'All' 
    ? allFriendExpenses 
    : getFriendExpensesByCategory(friendName, selectedCategory).filter(expense => 
        !tripId || expense.tripId === tripId
      );

  const totalSpent = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  const totalSpentOverall = allFriendExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate breakdown by category
  const categoryBreakdown = categories.map(category => {
    const categoryExpenses = tripId 
      ? getFriendExpensesByCategory(friendName, category).filter(expense => expense.tripId === tripId)
      : getFriendExpensesByCategory(friendName, category);
    
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = totalSpentOverall > 0 ? (total / totalSpentOverall) * 100 : 0;
    
    return {
      category,
      total,
      percentage,
      count: categoryExpenses.length,
    };
  }).filter(item => item.total > 0);

  const renderCategoryTab = (category) => (
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
      </Text>
    </TouchableOpacity>
  );

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
      </View>
      
      <View style={styles.expenseDetails}>
        {item.description && (
          <Text style={styles.expenseDescription}>{item.description}</Text>
        )}
        
        <Text style={styles.expenseDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderCategoryBreakdown = ({ item }) => (
    <View style={styles.breakdownItem}>
      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownCategory}>{item.category}</Text>
        <Text style={styles.breakdownCount}>({item.count} expenses)</Text>
      </View>
      
      <View style={styles.breakdownAmounts}>
        <Text style={styles.breakdownTotal}>₹{item.total.toFixed(2)}</Text>
        <Text style={styles.breakdownPercentage}>{item.percentage.toFixed(1)}%</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${item.percentage}%` }
          ]} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Friend Header */}
      <View style={styles.friendHeader}>
        <Text style={styles.friendName}>👤 {friendName}</Text>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>
            {tripId ? 'Trip Total' : 'Overall Total'}
          </Text>
          <Text style={styles.totalAmount}>₹{totalSpent.toFixed(2)}</Text>
          {!tripId && (
            <Text style={styles.overallTotal}>
              Overall: ₹{totalSpentOverall.toFixed(2)}
            </Text>
          )}
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
        </ScrollView>
      </View>

      {/* Category Breakdown */}
      {selectedCategory === 'All' && categoryBreakdown.length > 0 && (
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Spending by Category</Text>
          <FlatList
            data={categoryBreakdown}
            renderItem={renderCategoryBreakdown}
            keyExtractor={(item) => item.category}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Expenses List */}
      <View style={styles.expensesContainer}>
        <Text style={styles.expensesTitle}>
          {selectedCategory === 'All' ? 'All Expenses' : `${selectedCategory} Expenses`}
          {filteredExpenses.length > 0 && ` (${filteredExpenses.length})`}
        </Text>
        
        <FlatList
          data={filteredExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No expenses found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedCategory === 'All' 
                  ? 'This friend hasn\'t added any expenses yet'
                  : `No expenses in ${selectedCategory} category`
                }
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  friendHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  friendName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  totalInfo: {
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  overallTotal: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
  breakdownContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  breakdownItem: {
    marginBottom: 20,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  breakdownCount: {
    fontSize: 14,
    color: '#666',
  },
  breakdownAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  breakdownPercentage: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  expensesContainer: {
    flex: 1,
    padding: 20,
  },
  expensesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
    marginBottom: 5,
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
});

export default FriendSummaryScreen;