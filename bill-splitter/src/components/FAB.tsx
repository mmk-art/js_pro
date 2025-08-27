import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type Props = {
  onPress: () => void;
  style?: ViewStyle;
  label?: string;
};

export const FAB: React.FC<Props> = ({ onPress, style, label = "+" }) => {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.fab, style, pressed && styles.pressed] }>
      <Text style={styles.fabText}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pressed: { opacity: 0.8 },
  fabText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
});

