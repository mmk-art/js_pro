import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { getExpensesByTrip } from '../utils/storage';

const FriendSummaryScreen = ({ route }) => {
  const { friendName, tripId, tripName } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadFriendData();
  }, [friendName, tripId]);

  const loadFriendData = async () => {
    try {
      const allExpenses = await getExpensesByTrip(tripId);
      const friendExpenses = allExpenses.filter(expense => expense.friend === friendName);
      
      setExpenses(friendExpenses);
      
      // Calculate total spent by this friend
      const total = friendExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
      setTotalSpent(total);
      
      // Calculate category breakdown
      const breakdown = friendExpenses.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = {
            total: 0,
            count: 0,
            expenses: []
          };
        }
        acc[category].total += parseFloat(expense.amount || 0);
        acc[category].count += 1;
        acc[category].expenses.push(expense);
        return acc;
      }, {});
      
      setCategoryBreakdown(breakdown);
    } catch (error) {
      console.error('Error loading friend data:', error);
    }
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseAmount}>₹{parseFloat(item.amount).toFixed(2)}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
      </View>
      {item.description ? (
        <Text style={styles.expenseDescription}>{item.description}</Text>
      ) : null}
      <Text style={styles.expenseDate}>
        {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  const renderCategoryCard = (category, data) => (
    <View key={category} style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{category}</Text>
        <Text style={styles.categoryTotal}>₹{data.total.toFixed(2)}</Text>
      </View>
      <Text style={styles.categoryCount}>
        {data.count} expense{data.count !== 1 ? 's' : ''}
      </Text>
      <View style={styles.categoryPercentage}>
        <View 
          style={[
            styles.categoryBar, 
            { width: `${(data.total / totalSpent) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.categoryPercentageText}>
        {((data.total / totalSpent) * 100).toFixed(1)}% of total spending
      </Text>
    </View>
  );

  const sortedExpenses = expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1].total - a[1].total);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Total Spent Header */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{friendName}'s Total Spending</Text>
          <Text style={styles.totalAmount}>₹{totalSpent.toFixed(2)}</Text>
          <Text style={styles.tripName}>in {tripName}</Text>
        </View>

        {/* Category Breakdown */}
        {sortedCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            {sortedCategories.map(([category, data]) => renderCategoryCard(category, data))}
          </View>
        )}

        {/* Recent Expenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            All Expenses ({expenses.length})
          </Text>
          
          {expenses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No expenses found</Text>
              <Text style={styles.emptySubtext}>
                {friendName} hasn't added any expenses to this trip yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedExpenses}
              renderItem={renderExpenseItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Statistics */}
        {expenses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{expenses.length}</Text>
                <Text style={styles.statLabel}>Total Expenses</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  ₹{(totalSpent / expenses.length).toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Average per Expense</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{Object.keys(categoryBreakdown).length}</Text>
                <Text style={styles.statLabel}>Categories Used</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {sortedCategories.length > 0 ? sortedCategories[0][0] : 'N/A'}
                </Text>
                <Text style={styles.statLabel}>Top Category</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  totalLabel: {
    color: '#e0e7ff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  totalAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  tripName: {
    color: '#c7d2fe',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  categoryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  categoryCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  categoryPercentage: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 4,
  },
  categoryBar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  categoryPercentageText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  expenseCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
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
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default FriendSummaryScreen;