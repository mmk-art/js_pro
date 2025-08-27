import React, { useMemo } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useApp } from "../storage/AppContext";

export const FriendSummaryScreen: React.FC = () => {
  const route = useRoute<any>();
  const { trips } = useApp();
  const { tripId, friendId } = route.params as { tripId: string; friendId: string };
  const trip = useMemo(() => trips.find(t => t.id === tripId), [trips, tripId]);
  const friend = useMemo(() => trip?.friends.find(f => f.id === friendId), [trip, friendId]);

  if (!trip || !friend) {
    return <SafeAreaView style={styles.container}><Text style={styles.error}>Not found</Text></SafeAreaView>;
  }

  const expenses = trip.expenses.filter(e => e.friendId === friend.id);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const breakdown = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      const name = trip.categories.find(c => c.id === e.categoryId)?.name || "Other";
      acc[name] = (acc[name] || 0) + e.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.amount}>Total Spent: ₹ {total.toFixed(2)}</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={breakdown}
        keyExtractor={(i) => i.name}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cat}>{item.name}</Text>
            <Text style={styles.val}>₹ {item.value.toFixed(2)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  name: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  amount: { marginTop: 6, color: "#334155" },
  list: { padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#e2e8f0" },
  cat: { color: "#0f172a" },
  val: { color: "#0f172a", fontWeight: "600" },
  error: { color: "#dc2626" },
});

