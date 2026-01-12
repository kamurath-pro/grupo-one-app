import React from "react";
import { View, Text, ViewStyle, StyleSheet } from "react-native";
import { SPACING, TYPOGRAPHY, COLORS } from "./constants";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * ScreenHeader - Cabeçalho padrão de tela
 * 
 * Usado para títulos e subtítulos consistentes em todas as abas.
 * Opcionalmente inclui uma ação (botão) à direita.
 */
export function ScreenHeader({ title, subtitle, action, style }: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes["2xl"],
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs / 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.normal,
    color: COLORS.gray500,
  },
  action: {
    marginLeft: SPACING.md,
  },
});
