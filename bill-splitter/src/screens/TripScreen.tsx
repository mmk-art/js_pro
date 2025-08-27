import React, { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View, Alert, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useApp } from "../storage/AppContext";
import { Category, Expense, Trip } from "../storage/types";
import { Card } from "../components/Card";
import { FAB } from "../components/FAB";
import { CategoryTabs } from "../components/CategoryTabs";

export const TripScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { trips, deleteExpense, deleteTrip, updateTrip } = useApp();
  const { tripId } = route.params as { tripId: string };
  const trip = useMemo(() => trips.find(t => t.id === tripId), [trips, tripId]);

  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined);
  const [newCategory, setNewCategory] = useState<string>("");

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}><Text style={styles.empty}>Trip not found</Text></SafeAreaView>
    );
  }

  const categories: Category[] = trip.categories;
  const filteredExpenses = useMemo(() => {
    return activeCategoryId ? trip.expenses.filter(e => e.categoryId === activeCategoryId) : trip.expenses;
  }, [trip.expenses, activeCategoryId]);

  const total = useMemo(() => trip.expenses.reduce((s, e) => s + e.amount, 0), [trip.expenses]);

  const onAddExpense = () => navigation.navigate("ExpenseModal", { tripId: trip.id });
  const onAddCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    const exists = trip.categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) return Alert.alert("Category exists");
    updateTrip({ id: trip.id, categories: [...trip.categories, { id: Math.random().toString(36).slice(2), name }] });
    setNewCategory("");
  };

  const friendById = (id: string) => trip.friends.find(f => f.id === id)?.name || "Unknown";
  const categoryById = (id: string) => trip.categories.find(c => c.id === id)?.name || "Unknown";

  const onDeleteTrip = () => {
    Alert.alert("Delete Trip", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { deleteTrip(trip.id); navigation.goBack(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{trip.name}</Text>
        <Text style={styles.amount}>Total: ₹ {total.toFixed(2)}</Text>
        <Text onPress={onDeleteTrip} style={styles.deleteTrip}>Delete Trip</Text>
      </View>

      <CategoryTabs
        tabs={categories.map(c => ({ id: c.id, name: c.name }))}
        activeId={activeCategoryId}
        onChange={setActiveCategoryId}
      />

      <View style={styles.addCategoryRow}>
        <TextInput placeholder="New category" value={newCategory} onChangeText={setNewCategory} style={styles.input} />
        <Text style={styles.addButton} onPress={onAddCategory}>Add</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={filteredExpenses}
        keyExtractor={(e: Expense) => e.id}
        renderItem={({ item }) => (
          <Card
            title={`${friendById(item.friendId)} - ₹ ${item.amount.toFixed(2)}`}
            subtitle={`${categoryById(item.categoryId)}${item.note ? " · " + item.note : ""}`}
            onPress={() => navigation.navigate("FriendSummary", { tripId: trip.id, friendId: item.friendId })}
            right={
              <View style={{ flexDirection: 'row' }}>
                <Text onPress={() => navigation.navigate("ExpenseModal", { tripId: trip.id, expenseId: item.id })} style={styles.edit}>Edit</Text>
                <Text>  </Text>
                <Text onPress={() => deleteExpense(trip.id, item.id)} style={styles.delete}>Delete</Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No expenses yet. Tap + to add.</Text>}
      />

      <FAB onPress={onAddExpense} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  title: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  amount: { marginTop: 4, fontSize: 14, color: "#334155" },
  list: { padding: 16 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
  edit: { color: "#2563eb", fontWeight: "600" },
  delete: { color: "#dc2626", fontWeight: "600" },
  deleteTrip: { marginTop: 8, color: "#dc2626" },
  addCategoryRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  input: { flex: 1, backgroundColor: "#fff", marginRight: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#e2e8f0" },
  addButton: { color: "#2563eb", fontWeight: "600" },
});

