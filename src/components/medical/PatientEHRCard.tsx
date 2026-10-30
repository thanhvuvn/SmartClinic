import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SHADOWS } from '../../theme';
import { PATIENT_PROFILE } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { AppButton } from '../common/AppButton';

export interface PatientMasterIdentityCardProps {
  profile?: typeof PATIENT_PROFILE;
  onQrPress?: () => void;
  onBhytPress?: () => void;
  style?: ViewStyle;
}

export const PatientMasterIdentityCard: React.FC<PatientMasterIdentityCardProps> = ({
  profile = PATIENT_PROFILE,
  onQrPress,
  onBhytPress,
  style,
}) => {
  return (
    <View style={[styles.card, SHADOWS.sm, style]}>
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.secondary} />
          </View>
        </View>
        <View style={styles.identityCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.name}
            </Text>
            <Badge label={`${profile.age} tuổi • ${profile.gender}`} variant="surface" />
          </View>
          <Text style={styles.patientCode} numberOfLines={1}>
            Mã BN: {profile.patientCode}
          </Text>
          <View style={styles.pillsRow}>
            <Badge
              label={`Nhóm máu ${profile.bloodType}`}
              variant="surface"
              icon="water-outline"
            />
            <TouchableOpacity activeOpacity={0.8} onPress={onBhytPress}>
              <Badge label="BHYT: 80%" variant="blue" icon="card-outline" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.qrBox}
          activeOpacity={0.8}
          onPress={onQrPress}
        >
          <Ionicons name="qr-code-outline" size={20} color={COLORS.primary} />
          <Text style={styles.qrBoxText}>Mã y tế</Text>
        </TouchableOpacity>
      </View>

      {/* Vitals Strip */}
      <View style={styles.vitalsContainer}>
        <View style={styles.vitalsHeader}>
          <View style={styles.vitalsHeaderLeft}>
            <Ionicons name="pulse-outline" size={14} color={COLORS.primary} />
            <Text style={styles.vitalsTitle}>
              SINH HIỆU MỚI NHẤT (29/10/2024)
            </Text>
          </View>
          <View style={styles.stableRow}>
            <View style={styles.stableDot} />
            <Text style={styles.stableText}>Ổn định</Text>
          </View>
        </View>

        <View style={styles.vitalsGrid}>
          {profile.vitals.map((v) => (
            <View key={v.label} style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>{v.label}</Text>
              <Text
                style={[
                  styles.vitalValue,
                  v.highlight && { color: COLORS.primary },
                ]}
              >
                {v.value}
              </Text>
              <Text style={styles.vitalUnit}>{v.unit}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export interface VssIDInsuranceCardProps {
  profile?: typeof PATIENT_PROFILE;
  onDetailPress?: () => void;
  style?: ViewStyle;
}

export const VssIDInsuranceCard: React.FC<VssIDInsuranceCardProps> = ({
  profile = PATIENT_PROFILE,
  onDetailPress,
  style,
}) => {
  return (
    <LinearGradient
      colors={GRADIENTS.insuranceCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.vssidCard, SHADOWS.md, style]}
    >
      <View style={styles.vssidTopRow}>
        <View style={styles.vssidHeaderLeft}>
          <View style={styles.vssidShield}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#86F2E4" />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.vssidType}>BẢO HIỂM Y TẾ ĐIỆN TỬ</Text>
            <Text style={styles.vssidSync}>VssID Đồng bộ thời gian thực</Text>
          </View>
        </View>
        <Badge label="Hiệu lực" variant="teal" showDot />
      </View>

      <Text style={styles.vssidCodeLabel}>Mã số BHYT toàn quốc</Text>
      <Text style={styles.vssidCodeValue}>{profile.bhytCode}</Text>

      <View style={styles.vssidMetaBox}>
        <View style={styles.vssidMetaRow}>
          <Text style={styles.vssidMetaKey}>Nơi ĐKKCB Ban Đầu:</Text>
          <Text style={styles.vssidMetaVal} numberOfLines={1}>
            {profile.bhytHospital}
          </Text>
        </View>
        <View style={[styles.vssidMetaRow, { marginTop: 4 }]}>
          <Text style={styles.vssidMetaKey}>Hạn bảo hiểm:</Text>
          <Text style={styles.vssidMetaVal} numberOfLines={1}>
            {profile.bhytExpiry}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.vssidBtn}
        activeOpacity={0.8}
        onPress={onDetailPress}
      >
        <Text style={styles.vssidBtnText} numberOfLines={1}>
          Tra cứu chi tiết & Lịch sử quỹ chi trả
        </Text>
        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export interface ProfileHeaderCardProps {
  profile?: typeof PATIENT_PROFILE;
  onEditPress?: () => void;
  onQrPress?: () => void;
  style?: ViewStyle;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  profile = PATIENT_PROFILE,
  onEditPress,
  onQrPress,
  style,
}) => {
  return (
    <View style={[styles.card, SHADOWS.sm, style]}>
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: profile.avatar }} style={styles.avatarLg} />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.secondary} />
          </View>
        </View>
        <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
          <View style={styles.nameRow}>
            <Text style={styles.nameLg} numberOfLines={1}>
              {profile.name}
            </Text>
            <Badge label="eKYC" variant="teal" icon="shield-checkmark-outline" />
          </View>
          <Text style={styles.metaText} numberOfLines={1}>
            {profile.age} tuổi • {profile.gender} • Nhóm máu{' '}
            <Text style={{ color: COLORS.primary, fontWeight: '800' }}>
              {profile.bloodType}
            </Text>
          </Text>
          <View style={styles.codeCopyPill}>
            <Text style={styles.codeCopyText} numberOfLines={1}>
              {profile.patientCode}
            </Text>
            <Ionicons name="copy-outline" size={13} color={COLORS.primary} />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.tierBar} activeOpacity={0.8}>
        <View style={[styles.tierLeft, { flex: 1, minWidth: 0, marginRight: 8 }]}>
          <Ionicons name="ribbon-outline" size={16} color={COLORS.primary} />
          <Text style={[styles.tierText, { flex: 1 }]} numberOfLines={1}>
            {profile.tier}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={15} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <AppButton
          title="Chỉnh sửa hồ sơ"
          variant="tonal"
          size="md"
          leftIcon="create-outline"
          fullWidth={false}
          style={{ flex: 1 }}
          onPress={onEditPress}
        />
        <AppButton
          title="Mã QR Y Tế"
          variant="primary"
          size="md"
          leftIcon="qr-code-outline"
          fullWidth={false}
          style={{ flex: 1 }}
          onPress={onQrPress}
        />
      </View>

      <View style={styles.emergencyStrip}>
        <Ionicons name="medical" size={14} color={COLORS.error} />
        <Text style={styles.emergencyText} numberOfLines={1}>
          Khẩn cấp: <Text style={{ fontWeight: '700' }}>{profile.emergencyContact}</Text>
        </Text>
        <Ionicons name="call-outline" size={16} color={COLORS.primary} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  avatarLg: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  identityCol: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  nameLg: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  patientCode: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  qrBox: {
    backgroundColor: '#E0F2FE',
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  qrBoxText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  vitalsContainer: {
    marginTop: 14,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  vitalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  vitalsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    minWidth: 0,
  },
  vitalsTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  stableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  stableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
  stableText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  vitalItem: {
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
  },
  vitalValue: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  vitalUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  vssidCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
  },
  vssidTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  vssidHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  vssidShield: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  vssidType: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  vssidSync: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  vssidCodeLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  vssidCodeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    marginTop: 2,
    marginBottom: 12,
  },
  vssidMetaBox: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 12,
  },
  vssidMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  vssidMetaKey: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  vssidMetaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  vssidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: RADIUS.md,
    paddingVertical: 9,
    gap: 6,
  },
  vssidBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  codeCopyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginTop: 6,
    gap: 6,
  },
  codeCopyText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tierBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginVertical: 12,
  },
  tierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  emergencyStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  emergencyText: {
    flex: 1,
    fontSize: 11.5,
    color: COLORS.textPrimary,
  },
});

