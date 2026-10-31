import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, TYPOGRAPHY } from '../../theme';
import { SpecialtyItem } from '../../data/mockData';

export interface SpecialtyGridProps {
  items: SpecialtyItem[];
  selectedId?: string;
  onSelect?: (item: SpecialtyItem) => void;
  style?: ViewStyle;
}

export const SpecialtyGrid: React.FC<SpecialtyGridProps> = ({
  items,
  selectedId,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.grid, style]}>
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => onSelect?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`Chuyên khoa ${item.name}`}
            accessibilityState={{ selected: isSelected }}
            style={[
              styles.card,
              SHADOWS.sm,
              isSelected && styles.cardSelected,
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: item.bgColor },
              ]}
              importantForAccessibility="no-hide-descendants"
            >
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={21}
                color={item.iconColor}
              />
            </View>
            <Text
              style={styles.name}
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  card: {
    width: '23.2%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

