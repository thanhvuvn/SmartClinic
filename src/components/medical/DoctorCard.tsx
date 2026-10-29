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
import { COLORS, RADIUS, SHADOWS } from '../../theme';
import { DoctorItem } from '../../data/mockData';
import { AppButton } from '../common/AppButton';
import { Badge } from '../common/Badge';

export interface FeaturedDoctorCardProps {
  doctor: DoctorItem;
  onPress?: (doctor: DoctorItem) => void;
  onBookPress?: (doctor: DoctorItem) => void;
  style?: ViewStyle;
}

export const FeaturedDoctorCard: React.FC<FeaturedDoctorCardProps> = ({
  doctor,
  onPress,
  onBookPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(doctor)}
      style={[styles.featuredCard, SHADOWS.sm, style]}
    >
      <View style={styles.featuredTopRow}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatarSm} />
          {doctor.verified && (
            <View style={styles.verifiedBadgeSm}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
            </View>
          )}
        </View>
        <View style={styles.featuredInfo}>
          <Text style={styles.specialtyMeta} numberOfLines={1}>
            {doctor.specialty} • {doctor.experienceYears} năm KN
          </Text>
          <Text style={styles.doctorNameSm}>
            {doctor.name}
          </Text>
          <Text style={styles.hospitalSm}>
            {doctor.hospital}
          </Text>
        </View>
      </View>

      <View style={styles.ratingStrip}>
        <View style={styles.ratingLeft}>
          <Ionicons name="star" size={13} color={COLORS.warning} />
          <Text style={styles.ratingScore}>{doctor.rating}</Text>
          <Text style={styles.ratingCount}>({doctor.reviewCount}+)</Text>
        </View>
        <Text style={styles.availableTag}>{doctor.availableText}</Text>
      </View>

      <AppButton
        title="Đặt lịch"
        variant="primary"
        size="sm"
        leftIcon="calendar-outline"
        onPress={() => onBookPress?.(doctor)}
      />
    </TouchableOpacity>
  );
};

export interface DoctorProfileHeaderCardProps {
  doctor: DoctorItem;
  style?: ViewStyle;
}

export const DoctorProfileHeaderCard: React.FC<DoctorProfileHeaderCardProps> = ({
  doctor,
  style,
}) => {
  return (
    <View style={[styles.profileMainCard, SHADOWS.sm, style]}>
      <View style={styles.profileTopRow}>
        <View style={styles.avatarLgWrap}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatarLg} />
          <View style={styles.verifiedBadgeLg}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.secondary} />
          </View>
        </View>

        <View style={styles.profileInfoCol}>
          <View style={styles.badgesWrap}>
            <Badge
              label="Bác sĩ xác thực"
              variant="teal"
              icon="checkmark-circle"
            />
            <Badge label="BV ĐHYD TP.HCM" variant="blue" />
          </View>
          <Text style={styles.doctorNameLg}>{doctor.name}</Text>
          <Text style={styles.degreeText}>{doctor.degree}</Text>
          <Text style={styles.degreeHospitalText}>{doctor.hospital}</Text>
          <Text style={styles.subSpecialtyText}>{doctor.subSpecialty}</Text>
        </View>
      </View>

      {/* 4-column Quick Stats Strip */}
      <View style={styles.statsStrip}>
        <View style={styles.statCol}>
          <Text style={[styles.statVal, { color: COLORS.primary }]}>
            {doctor.experienceYears} năm
          </Text>
          <Text style={styles.statLabel}>Kinh nghiệm</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <View style={styles.ratingRowInline}>
            <Ionicons name="star" size={13} color={COLORS.warning} />
            <Text style={styles.statVal}>{doctor.rating}</Text>
          </View>
          <Text style={styles.statLabel}>{doctor.reviewCount}+ lượt</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{doctor.patientCount}</Text>
          <Text style={styles.statLabel}>Bệnh nhân</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={[styles.statVal, { color: COLORS.secondary }]}>
            {doctor.responseTime}
          </Text>
          <Text style={styles.statLabel}>Phản hồi</Text>
        </View>
      </View>

      {/* Fee & Insurance Banner */}
      <View style={styles.feeBanner}>
        <View style={styles.feeBannerLeft}>
          <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.feeTitle}>Phí tư vấn chuyên sâu</Text>
            <Text style={styles.feeSub}>{doctor.bhytSupport}</Text>
          </View>
        </View>
        <Text style={styles.feePrice}>{doctor.fee}</Text>
      </View>
    </View>
  );
};

export interface BookingDoctorSummaryCardProps {
  doctor: DoctorItem;
  style?: ViewStyle;
}

export const BookingDoctorSummaryCard: React.FC<BookingDoctorSummaryCardProps> = ({
  doctor,
  style,
}) => {
  return (
    <View style={[styles.summaryCard, SHADOWS.sm, style]}>
      <View style={styles.summaryTop}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatarMd} />
          <View style={styles.verifiedBadgeSm}>
            <Ionicons name="checkmark-circle" size={15} color={COLORS.secondary} />
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.doctorNameLg}>{doctor.name}</Text>
          <Text style={styles.degreeText}>{doctor.degree}</Text>
          <Text style={styles.degreeHospitalText}>{doctor.hospital}</Text>
          <View style={styles.summaryPillsRow}>
            <Badge
              label={`${doctor.rating} (${doctor.reviewCount}+)`}
              variant="blue"
              icon="star"
            />
            <Badge
              label={`${doctor.experienceYears} năm KN`}
              variant="surface"
              icon="briefcase-outline"
            />
          </View>
        </View>
      </View>

      <View style={styles.summaryFooter}>
        <View style={styles.summaryLocationRow}>
          <Ionicons name="location-outline" size={15} color={COLORS.primary} />
          <Text style={styles.summaryLocationText}>Cơ sở 1 - ĐHYD TP.HCM</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.feePrice}>{doctor.fee}</Text>
          <Text style={styles.feeSub}>Hỗ trợ BHYT</Text>
        </View>
      </View>
    </View>
  );
};

export interface PatientReviewCardProps {
  initials: string;
  initialsBg?: string;
  authorName: string;
  metaText: string;
  comment: string;
}

export const PatientReviewCard: React.FC<PatientReviewCardProps> = ({
  initials,
  initialsBg = COLORS.primaryContainer,
  authorName,
  metaText,
  comment,
}) => {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={[styles.initialsCircle, { backgroundColor: initialsBg }]}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={styles.reviewAuthor}>{authorName}</Text>
          <Text style={styles.reviewMeta}>{metaText}</Text>
        </View>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons key={s} name="star" size={12} color={COLORS.warning} />
          ))}
        </View>
      </View>
      <Text style={styles.reviewComment}>“{comment}”</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    width: 245,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featuredTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarSm: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.md,
    backgroundColor: '#E2E8F0',
  },
  verifiedBadgeSm: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  featuredInfo: {
    flex: 1,
    marginLeft: 10,
  },
  specialtyMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  doctorNameSm: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  hospitalSm: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ratingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 3,
  },
  availableTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  profileMainCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  profileTopRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  avatarLgWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatarLg: {
    width: 78,
    height: 92,
    borderRadius: RADIUS.md,
    backgroundColor: '#E2E8F0',
  },
  verifiedBadgeLg: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 1,
  },
  profileInfoCol: {
    flex: 1,
  },
  badgesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  doctorNameLg: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  degreeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  degreeHospitalText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  subSpecialtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: COLORS.outlineVariant,
  },
  ratingRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  feeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F3FF',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  feeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  feeSub: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  feePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  summaryTop: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarMd: {
    width: 62,
    height: 62,
    borderRadius: RADIUS.md,
  },
  summaryPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  summaryLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryLocationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  initialsCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  reviewAuthor: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textPrimary,
  },
});

