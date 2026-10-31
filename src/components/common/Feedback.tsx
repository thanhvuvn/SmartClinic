import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';
import { AppButton } from './AppButton';

export interface ToastBannerProps {
  visible: boolean;
  title: string;
  message?: string;
  onDismiss: () => void;
  durationMs?: number;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({
  visible,
  title,
  message,
  onDismiss,
  durationMs = 3200,
}) => {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, onDismiss]);

  if (!visible) return null;

  return (
    <View
      style={[styles.toastWrap, SHADOWS.md]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.toastIconCircle}>
        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.toastTextCol}>
        <Text style={styles.toastTitle} numberOfLines={1}>
          {title}
        </Text>
        {message ? (
          <Text style={styles.toastMsg} numberOfLines={2}>
            {message}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Đóng thông báo"
        style={styles.toastCloseBtn}
      >
        <Ionicons name="close" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-text-outline',
  title,
  description,
  actionTitle,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.emptyCard, SHADOWS.sm, style]}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name={icon} size={26} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDesc}>{description}</Text>
      {actionTitle && onActionPress ? (
        <AppButton
          title={actionTitle}
          variant="primary"
          size="sm"
          fullWidth={false}
          onPress={onActionPress}
          style={{ marginTop: SPACING.md }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrap: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.textPrimary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
  },
  toastIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  toastTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: SPACING.sm,
  },
  toastTitle: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  toastMsg: {
    fontSize: TYPOGRAPHY.micro,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  toastCloseBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.lg,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: TYPOGRAPHY.caption,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

