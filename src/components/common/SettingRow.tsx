import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, TOUCH } from '../../theme';
import { Badge } from './Badge';

export interface SettingToggleRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  footerNote?: string;
  footerActionLabel?: string;
  onFooterAction?: () => void;
  style?: ViewStyle;
}

export const SettingToggleRow: React.FC<SettingToggleRowProps> = ({
  icon,
  iconColor = COLORS.primary,
  title,
  description,
  value,
  onValueChange,
  footerNote,
  footerActionLabel,
  onFooterAction,
  style,
}) => {
  return (
    <View style={[styles.toggleCard, style]}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Ionicons
            name={icon}
            size={18}
            color={iconColor}
            style={styles.icon}
            importantForAccessibility="no"
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          accessibilityRole="switch"
          accessibilityLabel={title}
          accessibilityState={{ checked: value }}
          trackColor={{ false: COLORS.switchTrackOff, true: COLORS.primary }}
          thumbColor={COLORS.surface}
        />
      </View>
      <Text style={styles.description}>{description}</Text>

      {footerNote ? (
        <View style={styles.footerRow}>
          <View style={styles.footerLeft}>
            <Ionicons
              name="volume-high-outline"
              size={14}
              color={COLORS.secondary}
              importantForAccessibility="no"
            />
            <Text style={[styles.footerNoteText, { flex: 1 }]} numberOfLines={1}>
              {footerNote}
            </Text>
          </View>
          {footerActionLabel ? (
            <TouchableOpacity
              style={styles.footerBtn}
              onPress={onFooterAction}
              accessibilityRole="button"
              accessibilityLabel={footerActionLabel}
              hitSlop={TOUCH.hitSlopSm}
            >
              <Text style={styles.footerBtnText} numberOfLines={1}>
                {footerActionLabel}
              </Text>
              <Ionicons
                name="options-outline"
                size={13}
                color={COLORS.primary}
                importantForAccessibility="no"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export interface SettingLinkRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  rightToggleValue?: boolean;
  onRightToggleChange?: (val: boolean) => void;
  onPress?: () => void;
  isDownload?: boolean;
}

export const SettingLinkRow: React.FC<SettingLinkRowProps> = ({
  icon,
  title,
  subtitle,
  badgeLabel,
  rightToggleValue,
  onRightToggleChange,
  onPress,
  isDownload = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.linkRow}
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={title}
    >
      <View style={styles.linkIconWrap}>
        <Ionicons
          name={icon}
          size={18}
          color={COLORS.primary}
          importantForAccessibility="no"
        />
      </View>
      <View style={styles.linkTextCol}>
        <Text style={styles.linkTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.linkSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {badgeLabel ? <Badge label={badgeLabel} variant="blue" style={{ marginRight: 6 }} /> : null}
      {rightToggleValue !== undefined && onRightToggleChange ? (
        <Switch
          value={rightToggleValue}
          onValueChange={onRightToggleChange}
          accessibilityRole="switch"
          accessibilityLabel={title}
          accessibilityState={{ checked: rightToggleValue }}
          trackColor={{ false: COLORS.switchTrackOff, true: COLORS.secondary }}
          thumbColor={COLORS.surface}
        />
      ) : (
        <Ionicons
          name={isDownload ? 'download-outline' : 'chevron-forward'}
          size={18}
          color={isDownload ? COLORS.primary : COLORS.textMuted}
          importantForAccessibility="no"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  description: {
    fontSize: 11.5,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  footerNoteText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.secondary,
    marginLeft: 6,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  footerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  linkIconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  linkTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  linkSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

