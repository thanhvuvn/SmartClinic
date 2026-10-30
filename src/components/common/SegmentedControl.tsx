import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS } from '../../theme';

export interface SegmentOption {
  key: string;
  label: string;
  count?: number;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
  variant?: 'box' | 'chips' | 'primarySelect';
  style?: ViewStyle;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedKey,
  onSelect,
  variant = 'box',
  style,
}) => {
  if (variant === 'chips') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.chipsRow, style]}
      >
        {options.map((opt) => {
          const active = opt.key === selectedKey;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.8}
              onPress={() => onSelect(opt.key)}
              style={[
                styles.chipItem,
                active ? styles.chipActive : styles.chipInactive,
              ]}
            >
              {opt.icon && (
                <Ionicons
                  name={opt.icon}
                  size={14}
                  color={active ? COLORS.textOnPrimary : COLORS.textSecondary}
                  style={styles.chipIcon}
                />
              )}
              <Text
                style={[
                  styles.chipLabel,
                  active ? styles.chipLabelActive : styles.chipLabelInactive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.boxContainer, style]}>
      {options.map((opt) => {
        const active = opt.key === selectedKey;
        const isPrimaryVariant = variant === 'primarySelect';
        return (
          <TouchableOpacity
            key={opt.key}
            activeOpacity={0.85}
            onPress={() => onSelect(opt.key)}
            style={[
              styles.boxTab,
              active &&
                (isPrimaryVariant
                  ? styles.boxTabActivePrimary
                  : [styles.boxTabActiveWhite, SHADOWS.sm]),
            ]}
          >
            {opt.icon && (
              <Ionicons
                name={opt.icon}
                size={15}
                color={
                  active
                    ? isPrimaryVariant
                      ? COLORS.textOnPrimary
                      : COLORS.primary
                    : COLORS.textSecondary
                }
                style={styles.tabIcon}
              />
            )}
            <Text
              style={[
                styles.boxLabel,
                active
                  ? isPrimaryVariant
                    ? styles.boxLabelActivePrimary
                    : styles.boxLabelActive
                  : styles.boxLabelInactive,
              ]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
            {opt.count !== undefined && (
              <View
                style={[
                  styles.countBubble,
                  active ? styles.countBubbleActive : styles.countBubbleInactive,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    active ? styles.countTextActive : styles.countTextInactive,
                  ]}
                >
                  {opt.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.md,
    padding: 4,
  },
  boxTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  boxTabActiveWhite: {
    backgroundColor: COLORS.surface,
  },
  boxTabActivePrimary: {
    backgroundColor: COLORS.primary,
  },
  tabIcon: {
    marginRight: 6,
  },
  boxLabel: {
    fontSize: 12,
    textAlign: 'center',
    flexShrink: 1,
  },
  boxLabelActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  boxLabelActivePrimary: {
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  boxLabelInactive: {
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  countBubble: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  countBubbleActive: {
    backgroundColor: COLORS.primary,
  },
  countBubbleInactive: {
    backgroundColor: COLORS.surfaceVariant,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  countTextActive: {
    color: COLORS.textOnPrimary,
  },
  countTextInactive: {
    color: COLORS.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipInactive: {
    backgroundColor: COLORS.surfaceContainer,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: COLORS.textOnPrimary,
  },
  chipLabelInactive: {
    color: COLORS.textSecondary,
  },
});

