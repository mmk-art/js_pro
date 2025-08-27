import React, { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useApp } from "../storage/AppContext";
import { calculateTripTotal } from "../storage/storage";
import { Card } from "../components/Card";
import { FAB } from "../components/FAB";

export const HomeScreen: React.FC = () => {
  const { trips, addTrip } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const totalAllTrips = useMemo(() => trips.reduce((sum, t) => sum + calculateTripTotal(t), 0), [trips]);
  const [adding, setAdding] = useState(false);
  const [tripName, setTripName] = useState("");
  const [friendsCsv, setFriendsCsv] = useState("");

  const onAddTrip = () => {
    if (!adding) {
      setAdding(true);
      return;
    }
    const friendNames = friendsCsv.split(",").map(s => s.trim()).filter(Boolean);
    addTrip({ name: tripName.trim() || "New Trip", friendNames });
    setTripName("");
    setFriendsCsv("");
    setAdding(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Total Budget</Text>
        <Text style={styles.amount}>₹ {totalAllTrips.toFixed(2)}</Text>
      </View>

      {adding ? (
        <View style={styles.addBox}>
          <TextInput placeholder="Trip name" value={tripName} onChangeText={setTripName} style={styles.input} />
          <TextInput placeholder="Friends (comma separated)" value={friendsCsv} onChangeText={setFriendsCsv} style={styles.input} />
        </View>
      ) : null}

      <FlatList
        contentContainerStyle={styles.list}
        data={trips}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Card
            title={item.name}
            subtitle={`Spent: ₹ ${calculateTripTotal(item).toFixed(2)}`}
            onPress={() => navigation.navigate("Trip", { tripId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No trips yet. Tap + to add.</Text>}
      />

      <FAB onPress={onAddTrip} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  title: { fontSize: 14, color: "#64748b" },
  amount: { marginTop: 6, fontSize: 28, fontWeight: "700", color: "#0f172a" },
  list: { padding: 16 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
  addBox: { paddingHorizontal: 16, paddingVertical: 8 },
  input: {
    backgroundColor: "#fff",
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});

