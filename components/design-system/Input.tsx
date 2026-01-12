import React from "react";
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SPACING, RADIUS, COLORS, TYPOGRAPHY } from "./constants";

interface InputProps extends TextInputProps {
  label?: string;
  icon?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/**
 * Input - Campo de entrada padrão do design system
 * 
 * Input reutilizável com label, ícone e tratamento de erro.
 */
export function Input({
  label,
  icon,
  error,
  containerStyle,
  style,
  ...props
}: InputProps) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {icon && (
          <IconSymbol
            name={icon as any}
            size={20}
            color={error ? COLORS.error : COLORS.gray400}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.gray400}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    minHeight: 56,
  },
  inputContainerError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.gray900,
    minHeight: 56,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.error,
    marginTop: SPACING.xs / 2,
    marginLeft: SPACING.xs,
  },
});
