import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SPACING, RADIUS, COLORS } from "./constants";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

/**
 * SearchBar - Barra de busca padrão
 * 
 * Componente reutilizável para busca em listas.
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar...",
  onClear,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <IconSymbol name="magnifyingglass" size={18} color={COLORS.gray400} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray400}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText("");
            onClear?.();
          }}
          style={styles.clearButton}
        >
          <IconSymbol name="xmark.circle.fill" size={18} color={COLORS.gray400} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgSecondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
    fontSize: 16,
    color: COLORS.gray900,
  },
  clearButton: {
    padding: SPACING.xs,
  },
});
