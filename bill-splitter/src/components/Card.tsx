import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export const Card: React.FC<Props> = ({ title, subtitle, onPress, right, style }) => {
  const Container: any = onPress ? Pressable : View;
  return (
    <Container onPress={onPress} style={({ pressed }: any) => [styles.card, style, pressed && styles.pressed]}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: { opacity: 0.9 },
  texts: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  subtitle: { marginTop: 4, fontSize: 13, color: "#475569" },
});

