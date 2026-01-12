import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SPACING, COLORS, TYPOGRAPHY } from "./constants";

interface LoadingStateProps {
  message?: string;
}

/**
 * LoadingState - Estado de carregamento padrão
 * 
 * Exibido durante o carregamento de dados.
 */
export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray400,
  },
});
