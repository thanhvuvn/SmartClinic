import { Platform, ViewStyle } from 'react-native';

export const COLORS = {
  // Primary Medical Blue (extracted from Figma)
  primary: '#006194',
  primaryDark: '#004B73',
  primaryLight: '#1E6091',
  primaryContainer: '#CCE5FF',
  onPrimaryContainer: '#001D31',

  // Secondary Clinical Teal
  secondary: '#006A61',
  secondaryLight: '#006F66',
  secondaryDark: '#005049',
  secondaryContainer: '#86F2E4',
  secondaryContainerBright: '#89F5E7',
  onSecondaryContainer: '#00201D',

  // Backgrounds & Surfaces (Material 3 Cool Medical Surface)
  background: '#FAF8FF',
  surface: '#FFFFFF',
  surfaceContainerLow: '#F2F3FF',
  surfaceContainer: '#EAEDFF',
  surfaceContainerHigh: '#E2E7FF',
  surfaceVariant: '#DAE2FD',

  // Text & Icons
  textPrimary: '#131B2E',
  textSecondary: '#3F4850',
  textMuted: '#707881',
  textOnPrimary: '#FFFFFF',
  placeholder: '#707881',

  // Borders & Outlines
  outline: '#BFC7D2',
  outlineVariant: '#DAE2FD',
  border: '#E2E8F0',
  borderSubtle: '#EEF2FF',
  divider: '#F1F5F9',
  switchTrackOff: '#CBD5E1',

  // Semantic Status Colors
  error: '#BA1A1A',
  errorDark: '#93000A',
  errorContainer: '#FFDAD6',
  errorSurface: '#FFF5F5',
  warning: '#F59E0B',
  warningText: '#B45309',
  warningContainer: '#FEF3C7',
  success: '#006A61',
  successDot: '#10B981',

  // Specialty Icon Tints
  tintRed: '#FFE4E6',
  tintRedIcon: '#BE123C',
  tintBlue: '#E0EAFF',
  tintBlueIcon: '#006194',
  tintTeal: '#CCFBF1',
  tintTealIcon: '#006A61',
  tintIndigo: '#E0E7FF',
  tintIndigoIcon: '#3730A3',
} as const;

export const GRADIENTS = {
  primaryTeal: ['#006194', '#006A61'] as const,
  heroCard: ['#006194', '#00577A', '#006A61'] as const,
  insuranceCard: ['#133A5E', '#006194', '#006A61'] as const,
  splashBg: ['#E6F7F8', '#F2F3FF', '#FAF8FF'] as const,
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  display: 24,
  h1: 20,
  h2: 17,
  title: 15,
  body: 14,
  bodySm: 13,
  caption: 12,
  micro: 11,
  lineHeight: {
    tight: 16,
    normal: 19,
    relaxed: 22,
  },
  size: {
    xxs: 11,
    xs: 12,
    sm: 13,
    md: 14,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    hero: 28,
  },
} as const;

export const TOUCH = {
  min: 44,
  hitSlopSm: { top: 6, bottom: 6, left: 6, right: 6 },
  hitSlopMd: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;

export const LAYOUT: {
  maxWidth: number;
  card: ViewStyle;
} = {
  maxWidth: 640,
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
};

export const SHADOWS: Record<'sm' | 'md' | 'lg', ViewStyle> = {
  sm: Platform.select({
    ios: {
      shadowColor: '#131B2E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: '#131B2E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
    },
  }) as ViewStyle,
  md: Platform.select({
    ios: {
      shadowColor: '#006194',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
    default: {
      shadowColor: '#006194',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
  }) as ViewStyle,
  lg: Platform.select({
    ios: {
      shadowColor: '#006194',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 18,
    },
    android: {
      elevation: 8,
    },
    default: {
      shadowColor: '#006194',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 18,
    },
  }) as ViewStyle,
};

