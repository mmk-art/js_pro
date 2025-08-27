import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Tab = { id: string; name: string };

type Props = {
  tabs: Tab[];
  activeId?: string;
  onChange: (id: string) => void;
  onAddNew?: () => void;
};

export const CategoryTabs: React.FC<Props> = ({ tabs, activeId, onChange, onAddNew }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {tabs.map(tab => {
        const active = tab.id === activeId;
        return (
          <Text key={tab.id} onPress={() => onChange(tab.id)} style={[styles.chip, active && styles.chipActive]}>
            {tab.name}
          </Text>
        );
      })}
      {onAddNew ? (
        <Text onPress={onAddNew} style={[styles.chip, styles.addChip]}>+ Add</Text>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
  },
  chipActive: { backgroundColor: "#3b82f6", color: "#fff" },
  addChip: { backgroundColor: "#d1fae5", color: "#065f46" },
});

