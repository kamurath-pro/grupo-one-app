import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SPACING, COLORS, TYPOGRAPHY } from "./constants";
import { Card } from "./Card";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * EmptyState - Estado vazio padrão
 * 
 * Exibido quando não há conteúdo para mostrar.
 * Pode incluir uma ação (botão) opcional.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button onPress={onAction} variant="primary" size="md">
            {actionLabel}
          </Button>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: SPACING.xl * 1.5,
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.gray900,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.normal,
    color: COLORS.gray500,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  action: {
    width: "100%",
    maxWidth: 200,
  },
});
