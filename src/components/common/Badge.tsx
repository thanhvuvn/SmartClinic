import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../../theme';

export type BadgeVariant =
  | 'teal'
  | 'blue'
  | 'primarySolid'
  | 'danger'
  | 'warning'
  | 'surface'
  | 'glass';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  showDot?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'teal',
  icon,
  showDot = false,
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'teal':
        return {
          bg: COLORS.secondaryContainer,
          text: COLORS.onSecondaryContainer,
          dot: COLORS.secondary,
        };
      case 'blue':
        return {
          bg: COLORS.primaryContainer,
          text: COLORS.primary,
          dot: COLORS.primary,
        };
      case 'primarySolid':
        return {
          bg: COLORS.primary,
          text: COLORS.textOnPrimary,
          dot: '#86F2E4',
        };
      case 'danger':
        return {
          bg: COLORS.errorContainer,
          text: COLORS.error,
          dot: COLORS.error,
        };
      case 'warning':
        return {
          bg: COLORS.warningContainer,
          text: COLORS.warningText,
          dot: COLORS.warning,
        };
      case 'glass':
        return {
          bg: 'rgba(255, 255, 255, 0.18)',
          text: '#FFFFFF',
          dot: '#86F2E4',
        };
      case 'surface':
      default:
        return {
          bg: COLORS.surfaceContainer,
          text: COLORS.textSecondary,
          dot: COLORS.primary,
        };
    }
  };

  const palette = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      {showDot && <View style={[styles.dot, { backgroundColor: palette.dot }]} />}
      {icon && (
        <Ionicons
          name={icon}
          size={12}
          color={palette.text}
          style={styles.icon}
          importantForAccessibility="no"
        />
      )}
      <Text
        style={[styles.label, { color: palette.text }]}
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    maxWidth: '100%',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    flexShrink: 0,
  },
  icon: {
    marginRight: 4,
    flexShrink: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
  },
});

