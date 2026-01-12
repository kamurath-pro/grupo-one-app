import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { SPACING, RADIUS, COLORS, TYPOGRAPHY } from "./constants";

interface ToggleButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

/**
 * ToggleButton - Botão de alternância padrão
 * 
 * Usado para seleção de opções (ex: Sócio/Colaborador, Consultora/Gerente).
 */
export function ToggleButton({ label, selected, onPress, style }: ToggleButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected ? styles.buttonSelected : styles.buttonUnselected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: {
    backgroundColor: COLORS.primary,
  },
  buttonUnselected: {
    backgroundColor: COLORS.gray100,
  },
  text: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  textSelected: {
    color: COLORS.white,
  },
  textUnselected: {
    color: COLORS.gray900,
  },
});
