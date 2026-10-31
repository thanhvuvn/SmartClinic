import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, TOUCH, TYPOGRAPHY } from '../../theme';
import { HospitalItem } from '../../data/mockData';

export interface HospitalCardProps {
  hospital: HospitalItem;
  onMapPress?: (hospital: HospitalItem) => void;
  style?: ViewStyle;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  onMapPress,
  style,
}) => {
  return (
    <View style={[styles.card, SHADOWS.sm, style]}>
      <Image
        source={{ uri: hospital.image }}
        style={styles.thumb}
        accessibilityLabel={`Ảnh ${hospital.name}`}
      />
      <View style={styles.infoCol}>
        <View style={styles.titleRow}>
          <Ionicons
            name="add-circle-outline"
            size={15}
            color={COLORS.primary}
            style={{ marginRight: 4 }}
            importantForAccessibility="no"
          />
          <Text style={styles.name} numberOfLines={1}>
            {hospital.name}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons
            name="star"
            size={13}
            color={COLORS.warning}
            importantForAccessibility="no"
          />
          <Text style={styles.rating}>{hospital.rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.distance}>{hospital.distance}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.tag} numberOfLines={1}>
            {hospital.tag}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.mapBtn}
        activeOpacity={0.8}
        onPress={() => onMapPress?.(hospital)}
        accessibilityRole="button"
        accessibilityLabel={`Xem bản đồ ${hospital.name}`}
        hitSlop={TOUCH.hitSlopSm}
      >
        <Ionicons
          name="navigate-outline"
          size={14}
          color={COLORS.primary}
          importantForAccessibility="no"
        />
        <Text style={styles.mapBtnText}>Bản đồ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    marginRight: 12,
    backgroundColor: COLORS.surfaceContainer,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.warning,
    marginLeft: 3,
  },
  dot: {
    marginHorizontal: 5,
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.xxs,
  },
  distance: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tag: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  mapBtnText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

