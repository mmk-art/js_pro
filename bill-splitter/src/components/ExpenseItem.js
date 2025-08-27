import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ExpenseItem = ({ expense, friend, onPress, onFriendPress }) => {
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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <View 
          style={[
            styles.categoryIcon, 
            { backgroundColor: getCategoryColor(expense.category) }
          ]}
        >
          <Ionicons 
            name={getCategoryIcon(expense.category)} 
            size={20} 
            color="white" 
          />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.category}>{expense.category}</Text>
          {expense.description && (
            <Text style={styles.description} numberOfLines={1}>
              {expense.description}
            </Text>
          )}
          <Text style={styles.date}>
            {new Date(expense.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.friendButton} 
          onPress={onFriendPress}
        >
          <Text style={styles.friendName} numberOfLines={1}>
            {friend?.name || 'Unknown'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  friendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: 120,
  },
  friendName: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
});

export default ExpenseItem;