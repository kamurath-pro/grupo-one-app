/**
 * Design System Constants
 * Espaçamentos, cores e valores reutilizáveis padronizados
 */

// Espaçamentos (spacing scale)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radius
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Cores do design system
export const COLORS = {
  // Primary
  primary: "#003FC3",
  primaryLight: "#E6F0FF",
  primaryDark: "#002A8A",
  
  // Gray scale
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
  
  // Status
  success: "#22C55E",
  successLight: "#DCFCE7",
  warning: "#FF9012",
  warningLight: "#FFF3E0",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  
  // Base
  white: "#FFFFFF",
  black: "#000000",
  
  // Backgrounds
  bgPrimary: "#F9FAFB", // gray-50
  bgSecondary: "#FFFFFF",
} as const;

// Tipografia
export const TYPOGRAPHY = {
  // Tamanhos
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  // Pesos
  weights: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;

// Largura máxima para telas grandes
export const MAX_CONTENT_WIDTH = 800;
