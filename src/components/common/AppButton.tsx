import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SHADOWS, TOUCH } from '../../theme';

export type ButtonVariant =
  | 'gradient'
  | 'primary'
  | 'secondary'
  | 'tonal'
  | 'outline'
  | 'danger'
  | 'dangerOutline'
  | 'google'
  | 'white';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
}) => {
  const heightMap: Record<ButtonSize, number> = {
    sm: 40,
    md: 46,
    lg: 52,
  };

  const fontSizeMap: Record<ButtonSize, number> = {
    sm: 12.5,
    md: 14,
    lg: 15,
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'gradient':
      case 'primary':
      case 'secondary':
      case 'danger':
        return COLORS.textOnPrimary;
      case 'tonal':
      case 'outline':
      case 'white':
        return COLORS.primary;
      case 'dangerOutline':
        return COLORS.error;
      case 'google':
        return COLORS.textPrimary;
      default:
        return COLORS.textOnPrimary;
    }
  };

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: COLORS.primary, ...SHADOWS.sm };
      case 'secondary':
        return { backgroundColor: COLORS.secondary, ...SHADOWS.sm };
      case 'tonal':
        return { backgroundColor: COLORS.surfaceContainerHigh };
      case 'outline':
        return {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.outline,
        };
      case 'danger':
        return { backgroundColor: COLORS.error };
      case 'dangerOutline':
        return {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.errorContainer,
        };
      case 'google':
        return {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.border,
          ...SHADOWS.sm,
        };
      case 'white':
        return {
          backgroundColor: COLORS.surface,
          ...SHADOWS.sm,
        };
      default:
        return {};
    }
  };

  const textColor = getTextColor();
  const iconSize = size === 'sm' ? 15 : 18;

  const content = (
    <View style={styles.contentRow}>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {variant === 'google' && (
            <View style={styles.googleBadge}>
              <Text style={styles.googleG}>G</Text>
            </View>
          )}
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={iconSize}
              color={textColor}
              style={styles.leftIcon}
              importantForAccessibility="no"
            />
          )}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize: fontSizeMap[size] },
              textStyle,
            ]}
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
          >
            {title}
          </Text>
          {rightIcon && (
            <Ionicons
              name={rightIcon}
              size={iconSize}
              color={textColor}
              style={styles.rightIcon}
              importantForAccessibility="no"
            />
          )}
        </>
      )}
    </View>
  );

  const styles_padHorizontal: Record<ButtonSize, number> = {
    sm: 10,
    md: 12,
    lg: 16,
  };

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        hitSlop={size === 'sm' ? TOUCH.hitSlopSm : undefined}
        style={[
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          SHADOWS.md,
          style,
        ]}
      >
        <LinearGradient
          colors={GRADIENTS.primaryTeal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            {
              minHeight: heightMap[size],
              paddingHorizontal: styles_padHorizontal[size],
              borderRadius: RADIUS.md,
            },
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      hitSlop={size === 'sm' ? TOUCH.hitSlopSm : undefined}
      style={[
        styles.base,
        {
          minHeight: heightMap[size],
          paddingHorizontal: styles_padHorizontal[size],
          borderRadius: RADIUS.md,
        },
        getContainerStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 0,
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    minWidth: 0,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  leftIcon: {
    marginRight: 6,
  },
  rightIcon: {
    marginLeft: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  googleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleG: {
    fontWeight: '800',
    fontSize: 14,
    color: '#EA4335',
  },
});

