import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../contexts/DataContext';
import ExpenseItem from '../components/ExpenseItem';

const FriendSummaryScreen = ({ route }) => {
  const { friendId, friendName } = route.params;
  const { 
    getFriendExpenses, 
    trips,
    friends 
  } = useData();
  
  const [expenses, setExpenses] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (friendId) {
      const friendExpenses = getFriendExpenses(friendId);
      setExpenses(friendExpenses);
      
      // Calculate total spent
      const total = friendExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalSpent(total);
      
      // Calculate category breakdown
      const breakdown = {};
      friendExpenses.forEach(expense => {
        if (breakdown[expense.category]) {
          breakdown[expense.category] += expense.amount;
        } else {
          breakdown[expense.category] = expense.amount;
        }
      });
      setCategoryBreakdown(breakdown);
    }
  }, [friendId]);

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return 'restaurant';
      case 'travel':
        return 'car';
      case 'accommodation':
        return 'bed';
      case 'entertainment':
        return 'game-controller';
      case 'shopping':
        return 'bag';
      case 'snacks':
        return 'cafe';
      default:
        return 'receipt';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return '#FF6B6B';
      case 'travel':
        return '#4ECDC4';
      case 'accommodation':
        return '#45B7D1';
      case 'entertainment':
        return '#96CEB4';
      case 'shopping':
        return '#FFEAA7';
      case 'snacks':
        return '#DDA0DD';
      default:
        return '#95A5A6';
    }
  };

  const renderExpenseItem = ({ item }) => {
    const trip = trips.find(t => t.id === item.tripId);
    return (
      <View style={styles.expenseItem}>
        <ExpenseItem
          expense={item}
          friend={friends.find(f => f.id === item.friendId)}
          onPress={() => {}}
          onFriendPress={() => {}}
        />
        <Text style={styles.tripName}>{trip?.name}</Text>
      </View>
    );
  };

  const renderCategoryItem = ({ item }) => {
    const [category, amount] = item;
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    
    return (
      <View style={styles.categoryItem}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryInfo}>
            <View 
              style={[
                styles.categoryIcon, 
                { backgroundColor: getCategoryColor(category) }
              ]}
            >
              <Ionicons 
                name={getCategoryIcon(category)} 
                size={20} 
                color="white" 
              />
            </View>
            <View>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryPercentage}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
          <Text style={styles.categoryAmount}>₹{amount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: getCategoryColor(category)
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  if (!friendId) {
    return (
      <View style={styles.errorContainer}>
        <Text>Friend not found</Text>
      </View>
    );
  }

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a);

  return (
    <View style={styles.container}>
      {/* Friend Header */}
      <View style={styles.header}>
        <View style={styles.friendInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View style={styles.friendDetails}>
            <Text style={styles.friendName}>{friendName}</Text>
            <Text style={styles.expenseCount}>
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <View style={styles.totalSpent}>
          <Text style={styles.totalLabel}>Total Spent</Text>
          <Text style={styles.totalAmount}>₹{totalSpent.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          {sortedCategories.length > 0 ? (
            <FlatList
              data={sortedCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item[0]}
              scrollEnabled={false}
              style={styles.categoriesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No expenses yet</Text>
            </View>
          )}
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenses.length > 0 ? (
            <FlatList
              data={expenses.slice(0, 5)}
              renderItem={renderExpenseItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              style={styles.expensesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No expenses yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  expenseCount: {
    fontSize: 14,
    color: '#666',
  },
  totalSpent: {
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoriesList: {
    marginBottom: 16,
  },
  categoryItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  expensesList: {
    marginBottom: 16,
  },
  expenseItem: {
    marginBottom: 12,
  },
  tripName: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});

export default FriendSummaryScreen;