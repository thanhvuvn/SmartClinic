import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { SpecialtyItem } from '../../data/mockData';
import { PressableScale } from '../common/Animations';

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
          <PressableScale
            key={item.id}
            activeScale={0.93}
            onPress={() => onSelect?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`Chuyên khoa ${item.name}`}
            style={[
              styles.itemContainer,
              isSelected && styles.itemContainerSelected,
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: item.bgColor },
                isSelected && styles.iconCircleSelected,
              ]}
              importantForAccessibility="no-hide-descendants"
            >
              {item.icon === 'tooth-outline' ? (
                <MaterialCommunityIcons
                  name="tooth-outline"
                  size={22}
                  color={item.iconColor}
                />
              ) : (
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={item.iconColor}
                />
              )}
            </View>
            <Text
              style={[
                styles.name,
                isSelected && styles.nameSelected,
              ]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
            >
              {item.name}
            </Text>
          </PressableScale>
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
    rowGap: 14,
  },
  itemContainer: {
    width: '23.5%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemContainerSelected: {},
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconCircleSelected: {
    borderWidth: 2.5,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  nameSelected: {
    fontWeight: '800',
    color: COLORS.primary,
  },
});

