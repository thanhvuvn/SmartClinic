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
import { PressableScale } from '../common/Animations';

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
        <Text style={styles.name} numberOfLines={1}>
          {hospital.name}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {hospital.address}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.distanceBadge}>
            <Ionicons name="navigate" size={10} color={COLORS.primary} />
            <Text style={styles.distanceText}>{hospital.distance}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#B45309" />
            <Text style={styles.ratingText}>{hospital.rating}</Text>
          </View>
          <Text style={styles.tagText} numberOfLines={1}>
            {hospital.tag}
          </Text>
        </View>
      </View>

      <PressableScale
        style={styles.mapBtn}
        activeScale={0.92}
        onPress={() => onMapPress?.(hospital)}
        accessibilityRole="button"
        accessibilityLabel={`Xem bản đồ ${hospital.name}`}
      >
        <Ionicons
          name="navigate-outline"
          size={16}
          color={COLORS.primary}
          importantForAccessibility="no"
        />
        <Text style={styles.mapBtnText}>Bản đồ</Text>
      </PressableScale>
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
    borderColor: COLORS.borderSubtle,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.md,
    marginRight: 12,
    backgroundColor: COLORS.surfaceContainer,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
    justifyContent: 'center',
  },
  name: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  address: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    gap: 3,
  },
  distanceText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    gap: 2,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '800',
    color: '#B45309',
  },
  tagText: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textMuted,
    flexShrink: 1,
  },
  mapBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    gap: 2,
  },
  mapBtnText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

