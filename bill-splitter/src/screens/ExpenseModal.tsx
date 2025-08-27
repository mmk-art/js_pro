import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useApp } from "../storage/AppContext";
import { RootStackParamList } from "../navigation";

export const ExpenseModal: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { trips, addExpense, updateExpense } = useApp();
  const { tripId, expenseId } = route.params as { tripId: string; expenseId?: string };
  const trip = useMemo(() => trips.find(t => t.id === tripId), [trips, tripId]);
  const editing = Boolean(expenseId);

  const expense = useMemo(() => trip?.expenses.find(e => e.id === expenseId), [trip, expenseId]);
  const [amount, setAmount] = useState<string>(expense ? String(expense.amount) : "");
  const [note, setNote] = useState<string>(expense?.note || "");
  const [friendId, setFriendId] = useState<string>(expense?.friendId || (trip?.friends[0]?.id ?? ""));
  const [categoryId, setCategoryId] = useState<string>(expense?.categoryId || (trip?.categories[0]?.id ?? ""));

  if (!trip) {
    return <SafeAreaView style={styles.container}><Text style={styles.error}>Trip not found</Text></SafeAreaView>;
  }

  const onSave = () => {
    const amt = parseFloat(amount);
    if (!isFinite(amt) || amt <= 0) return;
    if (editing && expense) {
      updateExpense({ id: expense.id, tripId: trip.id, amount: amt, note, friendId, categoryId });
    } else {
      addExpense({ tripId: trip.id, amount: amt, note, friendId, categoryId });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Amount</Text>
        <TextInput placeholder="0" value={amount} keyboardType="numeric" onChangeText={setAmount} style={styles.input} />

        <Text style={styles.label}>Friend</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {trip.friends.map(f => {
            const active = f.id === friendId;
            return (
              <Text key={f.id} onPress={() => setFriendId(f.id)} style={[styles.chip, active && styles.chipActive]}>
                {f.name}
              </Text>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {trip.categories.map(c => {
            const active = c.id === categoryId;
            return (
              <Text key={c.id} onPress={() => setCategoryId(c.id)} style={[styles.chip, active && styles.chipActive]}>
                {c.name}
              </Text>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Note</Text>
        <TextInput placeholder="Optional" value={note} onChangeText={setNote} style={styles.input} />

        <Text onPress={onSave} style={styles.save}>Save</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { flex: 1 },
  label: { marginTop: 12, marginBottom: 6, color: "#334155" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e2e8f0" },
  row: { flexDirection: "row", alignItems: "center" },
  chips: { paddingVertical: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, backgroundColor: "#e2e8f0", borderRadius: 16, color: "#0f172a" },
  chipActive: { backgroundColor: "#3b82f6", color: "#fff" },
  save: { marginTop: 20, color: "#2563eb", fontWeight: "700", fontSize: 16 },
  error: { color: "#dc2626" },
});

