import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { SPACING, RADIUS, COLORS } from "./constants";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof SPACING;
  noPadding?: boolean;
}

/**
 * Card - Container padrão para conteúdo
 * 
 * Card reutilizável com estilo consistente.
 * Usado para agrupar conteúdo relacionado.
 */
export function Card({ children, style, padding = "md", noPadding = false }: CardProps) {
  const paddingValue = noPadding ? 0 : SPACING[padding];

  return (
    <View style={[styles.card, { padding: paddingValue }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
