import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme';

export type MainTabKey = 'home' | 'records' | 'appointments' | 'ai' | 'profile';

interface TabItemConfig {
  key: MainTabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItemConfig[] = [
  {
    key: 'home',
    label: 'Trang chủ',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    key: 'records',
    label: 'Khám bệnh',
    icon: 'medkit-outline',
    activeIcon: 'medkit',
  },
  {
    key: 'appointments',
    label: 'Lịch khám',
    icon: 'calendar-outline',
    activeIcon: 'calendar',
  },
  {
    key: 'ai',
    label: 'AI',
    icon: 'sparkles-outline',
    activeIcon: 'sparkles',
  },
  {
    key: 'profile',
    label: 'Cá nhân',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

export interface BottomTabBarProps {
  activeTab: MainTabKey;
  onSelectTab: (tab: MainTabKey) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <View style={[styles.container, SHADOWS.md]}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.75}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            <View
              style={[
                styles.iconPill,
                isActive && styles.iconPillActive,
              ]}
              importantForAccessibility="no-hide-descendants"
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={20}
                color={isActive ? COLORS.primary : COLORS.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconPill: {
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 2,
  },
  iconPillActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  label: {
    fontSize: 11,
  },
  labelActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  labelInactive: {
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});

