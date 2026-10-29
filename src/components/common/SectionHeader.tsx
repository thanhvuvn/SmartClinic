import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import { Badge, BadgeVariant } from './Badge';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  actionText?: string;
  onActionPress?: () => void;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  badgeIcon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  actionText,
  onActionPress,
  badgeText,
  badgeVariant = 'teal',
  badgeIcon,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftCol}>
        <View style={styles.titleRow}>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={18}
              color={COLORS.primary}
              style={styles.leftIcon}
            />
          )}
          <Text style={styles.title}>{title}</Text>
          {badgeText && (
            <Badge
              label={badgeText}
              variant={badgeVariant}
              icon={badgeIcon}
              style={styles.inlineBadge}
            />
          )}
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {actionText ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onActionPress}
          activeOpacity={0.75}
        >
          <Text style={styles.actionText}>{actionText}</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftCol: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  leftIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inlineBadge: {
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 2,
  },
});

