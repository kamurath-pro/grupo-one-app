import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SPACING, RADIUS, COLORS, TYPOGRAPHY } from "./constants";

interface ErrorAlertProps {
  message: string;
  visible?: boolean;
}

/**
 * ErrorAlert - Alerta de erro padrão
 * 
 * Exibe mensagens de erro de forma consistente.
 */
export function ErrorAlert({ message, visible = true }: ErrorAlertProps) {
  if (!visible || !message) return null;

  return (
    <View style={styles.container}>
      <IconSymbol name="exclamationmark.triangle.fill" size={16} color={COLORS.error} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.errorLight,
    marginBottom: SPACING.md,
  },
  text: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.error,
  },
});
